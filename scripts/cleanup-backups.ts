#!/usr/bin/env tsx

import { voteBackupManager } from '../src/lib/vote-backup-manager'

async function main() {
  try {
    console.log('🧹 Cleaning up old backups...')
    
    const keepCount = parseInt(process.argv[2]) || 10
    console.log(`📊 Keeping last ${keepCount} backups`)
    
    await voteBackupManager.cleanupOldBackups(keepCount)
    
    console.log('✅ Backup cleanup completed!')
    
    // Show remaining backups
    const remainingBackups = voteBackupManager.getAvailableBackups()
    console.log(`📁 Remaining backups: ${remainingBackups.length}`)
    
    remainingBackups.forEach((backup, index) => {
      console.log(`  ${index + 1}. ${backup}`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Backup cleanup failed:', error)
    process.exit(1)
  }
}

main()
