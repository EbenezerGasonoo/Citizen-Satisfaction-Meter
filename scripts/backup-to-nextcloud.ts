#!/usr/bin/env tsx

import { createNextcloudBackupManager } from '../src/lib/nextcloud-backup-manager'
import { voteBackupManager } from '../src/lib/vote-backup-manager'

async function main() {
  try {
    console.log('🔄 Creating backup and uploading to Nextcloud...')
    
    // Create Nextcloud backup manager
    const nextcloudManager = createNextcloudBackupManager()
    
    if (!nextcloudManager) {
      console.error('❌ Nextcloud configuration missing!')
      console.log('Please set the following environment variables:')
      console.log('  NEXTCLOUD_SERVER_URL=https://your-nextcloud.com')
      console.log('  NEXTCLOUD_USERNAME=your-username')
      console.log('  NEXTCLOUD_PASSWORD=your-password')
      console.log('  NEXTCLOUD_BACKUP_PATH=/backups/votes (optional)')
      process.exit(1)
    }
    
    // Test connection first
    const connectionOk = await nextcloudManager.testConnection()
    if (!connectionOk) {
      console.error('❌ Cannot connect to Nextcloud!')
      process.exit(1)
    }
    
    // Create and upload backup
    const result = await nextcloudManager.createAndUploadBackup()
    
    console.log('✅ Backup completed successfully!')
    console.log(`📁 Local backup: ${result.localFile}`)
    console.log(`☁️  Nextcloud backup: ${result.remoteFile}`)
    
    // Clean up old backups on Nextcloud
    await nextcloudManager.cleanupOldBackups(10)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Nextcloud backup failed:', error)
    process.exit(1)
  }
}

main()
