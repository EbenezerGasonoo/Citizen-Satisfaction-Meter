import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

export interface VoteBackup {
  id: number
  ministerId: number
  positive: boolean
  clientHash: string
  createdAt: Date
  updatedAt?: Date
}

export interface VoteBackupMetadata {
  timestamp: Date
  totalVotes: number
  totalMinisters: number
  backupVersion: string
  platformVersion: string
}

export class VoteBackupManager {
  private backupDir = path.join(process.cwd(), 'backups', 'votes')
  private metadataFile = path.join(this.backupDir, 'metadata.json')

  constructor() {
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
    }
  }

  /**
   * Create a complete backup of all votes
   */
  async createBackup(): Promise<string> {
    try {
      console.log('🔄 Creating vote backup...')
      
      // Get all votes
      const votes = await prisma.vote.findMany({
        orderBy: { createdAt: 'asc' }
      })

      // Get vote statistics
      const totalVotes = votes.length
      const totalMinisters = await prisma.minister.count()
      
      // Create backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const backupFile = path.join(this.backupDir, `votes-backup-${timestamp}.json`)
      
      // Create backup data
      const backupData = {
        metadata: {
          timestamp: new Date(),
          totalVotes,
          totalMinisters,
          backupVersion: '1.0',
          platformVersion: process.env.npm_package_version || '1.0.0'
        },
        votes: votes.map(vote => ({
          id: vote.id,
          ministerId: vote.ministerId,
          positive: vote.positive,
          clientHash: vote.clientHash,
          createdAt: vote.createdAt,
          updatedAt: vote.updatedAt
        }))
      }

      // Write backup file
      fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2))
      
      // Update metadata
      await this.updateMetadata(backupData.metadata)
      
      console.log(`✅ Vote backup created: ${backupFile}`)
      console.log(`📊 Backed up ${totalVotes} votes for ${totalMinisters} ministers`)
      
      return backupFile
    } catch (error) {
      console.error('❌ Error creating vote backup:', error)
      throw error
    }
  }

  /**
   * Restore votes from a backup file
   */
  async restoreBackup(backupFile: string): Promise<void> {
    try {
      console.log(`🔄 Restoring votes from: ${backupFile}`)
      
      // Read backup file
      const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'))
      
      if (!backupData.votes || !Array.isArray(backupData.votes)) {
        throw new Error('Invalid backup file format')
      }

      // Get current vote count for verification
      const currentVoteCount = await prisma.vote.count()
      console.log(`📊 Current votes in database: ${currentVoteCount}`)
      console.log(`📊 Votes in backup: ${backupData.votes.length}`)

      // Clear existing votes (optional - you might want to merge instead)
      console.log('🗑️ Clearing existing votes...')
      await prisma.vote.deleteMany()

      // Restore votes in batches to avoid memory issues
      const batchSize = 1000
      const batches = []
      
      for (let i = 0; i < backupData.votes.length; i += batchSize) {
        batches.push(backupData.votes.slice(i, i + batchSize))
      }

      console.log(`📦 Restoring ${batches.length} batches...`)
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} votes)`)
        
        await prisma.vote.createMany({
          data: batch.map(vote => ({
            ministerId: vote.ministerId,
            positive: vote.positive,
            clientHash: vote.clientHash,
            createdAt: new Date(vote.createdAt),
            updatedAt: vote.updatedAt ? new Date(vote.updatedAt) : undefined
          }))
        })
      }

      // Verify restoration
      const restoredCount = await prisma.vote.count()
      console.log(`✅ Vote restoration completed: ${restoredCount} votes restored`)
      
      if (restoredCount !== backupData.votes.length) {
        throw new Error(`Vote count mismatch: expected ${backupData.votes.length}, got ${restoredCount}`)
      }

    } catch (error) {
      console.error('❌ Error restoring vote backup:', error)
      throw error
    }
  }

  /**
   * Get list of available backups
   */
  getAvailableBackups(): string[] {
    try {
      const files = fs.readdirSync(this.backupDir)
      return files
        .filter(file => file.startsWith('votes-backup-') && file.endsWith('.json'))
        .map(file => path.join(this.backupDir, file))
        .sort((a, b) => {
          const statA = fs.statSync(a)
          const statB = fs.statSync(b)
          return statB.mtime.getTime() - statA.mtime.getTime()
        })
    } catch (error) {
      console.error('❌ Error listing backups:', error)
      return []
    }
  }

  /**
   * Get backup metadata
   */
  async getBackupMetadata(backupFile: string): Promise<VoteBackupMetadata | null> {
    try {
      const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'))
      return backupData.metadata || null
    } catch (error) {
      console.error('❌ Error reading backup metadata:', error)
      return null
    }
  }

  /**
   * Verify vote integrity
   */
  async verifyVoteIntegrity(): Promise<{
    isValid: boolean
    issues: string[]
    statistics: {
      totalVotes: number
      totalMinisters: number
      votesPerMinister: Record<number, number>
      dateRange: { earliest: Date | null, latest: Date | null }
    }
  }> {
    try {
      const votes = await prisma.vote.findMany({
        orderBy: { createdAt: 'asc' }
      })

      const ministers = await prisma.minister.findMany()
      const ministerIds = new Set(ministers.map(m => m.id))

      const issues: string[] = []
      const votesPerMinister: Record<number, number> = {}
      let earliest: Date | null = null
      let latest: Date | null = null

      for (const vote of votes) {
        // Check if minister exists
        if (!ministerIds.has(vote.ministerId)) {
          issues.push(`Vote ${vote.id} references non-existent minister ${vote.ministerId}`)
        }

        // Count votes per minister
        votesPerMinister[vote.ministerId] = (votesPerMinister[vote.ministerId] || 0) + 1

        // Track date range
        if (!earliest || vote.createdAt < earliest) {
          earliest = vote.createdAt
        }
        if (!latest || vote.createdAt > latest) {
          latest = vote.createdAt
        }
      }

      return {
        isValid: issues.length === 0,
        issues,
        statistics: {
          totalVotes: votes.length,
          totalMinisters: ministers.length,
          votesPerMinister,
          dateRange: { earliest, latest }
        }
      }
    } catch (error) {
      console.error('❌ Error verifying vote integrity:', error)
      return {
        isValid: false,
        issues: [`Error during verification: ${error}`],
        statistics: {
          totalVotes: 0,
          totalMinisters: 0,
          votesPerMinister: {},
          dateRange: { earliest: null, latest: null }
        }
      }
    }
  }

  /**
   * Update backup metadata
   */
  private async updateMetadata(metadata: VoteBackupMetadata): Promise<void> {
    try {
      const allMetadata = this.getAvailableBackups().map(file => ({
        file,
        metadata: this.getBackupMetadata(file)
      })).filter(item => item.metadata)

      fs.writeFileSync(this.metadataFile, JSON.stringify(allMetadata, null, 2))
    } catch (error) {
      console.error('❌ Error updating metadata:', error)
    }
  }

  /**
   * Clean up old backups (keep last 10)
   */
  async cleanupOldBackups(keepCount: number = 10): Promise<void> {
    try {
      const backups = this.getAvailableBackups()
      
      if (backups.length > keepCount) {
        const toDelete = backups.slice(keepCount)
        
        for (const backup of toDelete) {
          fs.unlinkSync(backup)
          console.log(`🗑️ Deleted old backup: ${backup}`)
        }
        
        console.log(`✅ Cleaned up ${toDelete.length} old backups`)
      }
    } catch (error) {
      console.error('❌ Error cleaning up backups:', error)
    }
  }
}

// Export singleton instance
export const voteBackupManager = new VoteBackupManager()
