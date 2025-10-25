#!/usr/bin/env tsx

import { voteBackupManager } from '../src/lib/vote-backup-manager'

async function main() {
  const backupFile = process.argv[2]
  
  if (!backupFile) {
    console.error('❌ Please provide a backup file path')
    console.log('Usage: npm run restore:votes <backup-file-path>')
    process.exit(1)
  }
  
  try {
    console.log('🔄 Restoring votes from backup...')
    console.log(`📁 Backup file: ${backupFile}`)
    
    await voteBackupManager.restoreBackup(backupFile)
    
    console.log('✅ Vote restoration completed successfully!')
    
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
    console.error('❌ Vote restoration failed:', error)
    process.exit(1)
  }
}

main()
