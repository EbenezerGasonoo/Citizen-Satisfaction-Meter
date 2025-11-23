import { NextRequest, NextResponse } from 'next/server'
import { voteBackupManager } from '@/lib/vote-backup-manager'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic'

// GET: Get backup status and available backups
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'status') {
      // Get vote integrity status
      const integrity = await voteBackupManager.verifyVoteIntegrity()
      return NextResponse.json({ integrity })
    }

    if (action === 'backups') {
      // Get available backups
      const backups = voteBackupManager.getAvailableBackups()
      const backupDetails = await Promise.all(
        backups.map(async (backup) => {
          const metadata = await voteBackupManager.getBackupMetadata(backup)
          return {
            file: backup,
            metadata
          }
        })
      )
      return NextResponse.json({ backups: backupDetails })
    }

    // Default: get current vote statistics
    const totalVotes = await prisma.vote.count()
    const totalMinisters = await prisma.minister.count()
    const votesToday = await prisma.vote.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    return NextResponse.json({
      statistics: {
        totalVotes,
        totalMinisters,
        votesToday,
        lastBackup: voteBackupManager.getAvailableBackups()[0] || null
      }
    })
  } catch (error) {
    console.error('Error fetching vote preservation data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vote preservation data' },
      { status: 500 }
    )
  }
}

// POST: Create backup, restore, or verify votes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, backupFile } = body

    if (action === 'create-backup') {
      // Create a new backup
      const backupFile = await voteBackupManager.createBackup()
      return NextResponse.json({
        success: true,
        message: 'Backup created successfully',
        backupFile
      })
    }

    if (action === 'restore-backup') {
      if (!backupFile) {
        return NextResponse.json(
          { error: 'Backup file is required' },
          { status: 400 }
        )
      }

      // Restore from backup
      await voteBackupManager.restoreBackup(backupFile)
      return NextResponse.json({
        success: true,
        message: 'Votes restored successfully'
      })
    }

    if (action === 'verify-integrity') {
      // Verify vote integrity
      const integrity = await voteBackupManager.verifyVoteIntegrity()
      return NextResponse.json({
        success: true,
        integrity
      })
    }

    if (action === 'cleanup-backups') {
      // Clean up old backups
      await voteBackupManager.cleanupOldBackups()
      return NextResponse.json({
        success: true,
        message: 'Old backups cleaned up successfully'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in vote preservation action:', error)
    return NextResponse.json(
      { error: 'Failed to perform vote preservation action' },
      { status: 500 }
    )
  }
}
