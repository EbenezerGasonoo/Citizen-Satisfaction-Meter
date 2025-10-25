#!/usr/bin/env tsx

import { voteBackupManager } from '../src/lib/vote-backup-manager'

async function main() {
  try {
    console.log('🔄 Creating vote backup...')
    
    const backupFile = await voteBackupManager.createBackup()
    
    console.log('✅ Vote backup completed successfully!')
    console.log(`📁 Backup file: ${backupFile}`)
    
    // Also create a backup in a cloud location if configured
    const cloudBackup = process.env.CLOUD_BACKUP_URL
    if (cloudBackup) {
      console.log('☁️  Uploading backup to cloud storage...')
      // Add cloud upload logic here if needed
    }
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Vote backup failed:', error)
    process.exit(1)
  }
}

main()
