import { WebDAVClient } from 'webdav'
import fs from 'fs'
import path from 'path'
import { voteBackupManager } from '../src/lib/vote-backup-manager'

interface NextcloudConfig {
  serverUrl: string
  username: string
  password: string
  remotePath: string
}

export class NextcloudBackupManager {
  private client: WebDAVClient
  private config: NextcloudConfig

  constructor(config: NextcloudConfig) {
    this.config = config
    this.client = new WebDAVClient({
      serverURL: config.serverUrl,
      username: config.username,
      password: config.password,
    })
  }

  /**
   * Upload a backup file to Nextcloud
   */
  async uploadBackup(localFilePath: string): Promise<string> {
    try {
      console.log('☁️ Uploading backup to Nextcloud...')
      
      const fileName = path.basename(localFilePath)
      const remoteFilePath = `${this.config.remotePath}/${fileName}`
      
      // Read the local file
      const fileBuffer = fs.readFileSync(localFilePath)
      
      // Upload to Nextcloud
      await this.client.putFileContents(remoteFilePath, fileBuffer)
      
      console.log(`✅ Backup uploaded to Nextcloud: ${remoteFilePath}`)
      return remoteFilePath
      
    } catch (error) {
      console.error('❌ Failed to upload backup to Nextcloud:', error)
      throw error
    }
  }

  /**
   * Download a backup file from Nextcloud
   */
  async downloadBackup(remoteFilePath: string, localFilePath: string): Promise<void> {
    try {
      console.log(`☁️ Downloading backup from Nextcloud: ${remoteFilePath}`)
      
      // Download from Nextcloud
      const fileBuffer = await this.client.getFileContents(remoteFilePath)
      
      // Write to local file
      fs.writeFileSync(localFilePath, fileBuffer)
      
      console.log(`✅ Backup downloaded from Nextcloud: ${localFilePath}`)
      
    } catch (error) {
      console.error('❌ Failed to download backup from Nextcloud:', error)
      throw error
    }
  }

  /**
   * List available backups on Nextcloud
   */
  async listBackups(): Promise<string[]> {
    try {
      console.log('📁 Listing backups on Nextcloud...')
      
      const contents = await this.client.getDirectoryContents(this.config.remotePath)
      
      const backups = contents
        .filter(item => item.type === 'file' && item.basename.startsWith('votes-backup-'))
        .map(item => item.filename)
        .sort()
      
      console.log(`📊 Found ${backups.length} backups on Nextcloud`)
      return backups
      
    } catch (error) {
      console.error('❌ Failed to list backups from Nextcloud:', error)
      throw error
    }
  }

  /**
   * Delete old backups from Nextcloud (keep last N)
   */
  async cleanupOldBackups(keepCount: number = 10): Promise<void> {
    try {
      console.log(`🧹 Cleaning up old backups on Nextcloud (keeping last ${keepCount})...`)
      
      const backups = await this.listBackups()
      
      if (backups.length > keepCount) {
        const toDelete = backups.slice(0, backups.length - keepCount)
        
        for (const backup of toDelete) {
          await this.client.deleteFile(backup)
          console.log(`🗑️ Deleted old backup from Nextcloud: ${backup}`)
        }
        
        console.log(`✅ Cleaned up ${toDelete.length} old backups from Nextcloud`)
      } else {
        console.log('✅ No old backups to clean up on Nextcloud')
      }
      
    } catch (error) {
      console.error('❌ Failed to cleanup backups on Nextcloud:', error)
      throw error
    }
  }

  /**
   * Create and upload backup to Nextcloud
   */
  async createAndUploadBackup(): Promise<{ localFile: string, remoteFile: string }> {
    try {
      console.log('🔄 Creating backup and uploading to Nextcloud...')
      
      // Create local backup
      const localBackupFile = await voteBackupManager.createBackup()
      
      // Upload to Nextcloud
      const remoteBackupFile = await this.uploadBackup(localBackupFile)
      
      console.log('✅ Backup created and uploaded to Nextcloud successfully!')
      return {
        localFile: localBackupFile,
        remoteFile: remoteBackupFile
      }
      
    } catch (error) {
      console.error('❌ Failed to create and upload backup:', error)
      throw error
    }
  }

  /**
   * Test Nextcloud connection
   */
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing Nextcloud connection...')
      
      // Try to list directory contents
      await this.client.getDirectoryContents(this.config.remotePath)
      
      console.log('✅ Nextcloud connection successful!')
      return true
      
    } catch (error) {
      console.error('❌ Nextcloud connection failed:', error)
      return false
    }
  }
}

// Factory function to create Nextcloud backup manager from environment variables
export function createNextcloudBackupManager(): NextcloudBackupManager | null {
  const serverUrl = process.env.NEXTCLOUD_SERVER_URL
  const username = process.env.NEXTCLOUD_USERNAME
  const password = process.env.NEXTCLOUD_PASSWORD
  const remotePath = process.env.NEXTCLOUD_BACKUP_PATH || '/backups/votes'

  if (!serverUrl || !username || !password) {
    console.warn('⚠️ Nextcloud configuration missing. Set NEXTCLOUD_SERVER_URL, NEXTCLOUD_USERNAME, and NEXTCLOUD_PASSWORD environment variables.')
    return null
  }

  return new NextcloudBackupManager({
    serverUrl,
    username,
    password,
    remotePath
  })
}
