#!/usr/bin/env tsx

import { createNextcloudBackupManager } from '../src/lib/nextcloud-backup-manager'
import { voteBackupManager } from '../src/lib/vote-backup-manager'
import fs from 'fs'
import path from 'path'

async function main() {
  const remoteBackupFile = process.argv[2]
  
  if (!remoteBackupFile) {
    console.error('❌ Please provide a remote backup file path')
    console.log('Usage: npm run restore:nextcloud <remote-backup-file-path>')
    console.log('')
    console.log('Available backups:')
    
    try {
      const nextcloudManager = createNextcloudBackupManager()
      if (nextcloudManager) {
        const backups = await nextcloudManager.listBackups()
        backups.forEach((backup, index) => {
          console.log(`  ${index + 1}. ${backup}`)
        })
      }
    } catch (error) {
      console.error('Could not list backups:', error)
    }
    
    process.exit(1)
  }
  
  try {
    console.log('🔄 Restoring votes from Nextcloud backup...')
    console.log(`☁️  Remote backup: ${remoteBackupFile}`)
    
    // Create Nextcloud backup manager
    const nextcloudManager = createNextcloudBackupManager()
    
    if (!nextcloudManager) {
      console.error('❌ Nextcloud configuration missing!')
      process.exit(1)
    }
    
    // Test connection first
    const connectionOk = await nextcloudManager.testConnection()
    if (!connectionOk) {
      console.error('❌ Cannot connect to Nextcloud!')
      process.exit(1)
    }
    
    // Create temporary local file
    const tempDir = './temp'
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    const localBackupFile = path.join(tempDir, path.basename(remoteBackupFile))
    
    // Download backup from Nextcloud
    await nextcloudManager.downloadBackup(remoteBackupFile, localBackupFile)
    
    // Restore from local file
    await voteBackupManager.restoreBackup(localBackupFile)
    
    // Clean up temporary file
    fs.unlinkSync(localBackupFile)
    
    console.log('✅ Vote restoration from Nextcloud completed successfully!')
    
    // Verify the restoration
    const integrity = await voteBackupManager.verifyVoteIntegrity()
    
    if (integrity.isValid) {
      console.log('✅ Vote integrity verified!')
      console.log(`📊 Total votes: ${integrity.statistics.totalVotes}`)
      console.log(`👥 Total ministers: ${integrity.statistics.totalMinisters}`)
    } else {
      console.warn('⚠️  Vote integrity issues detected:')
      integrity.issues.forEach(issue => console.warn(`  - ${issue}`))
    }
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Nextcloud restoration failed:', error)
    process.exit(1)
  }
}

main()
