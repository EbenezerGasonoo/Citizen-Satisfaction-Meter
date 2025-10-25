#!/usr/bin/env tsx

import { voteBackupManager } from '../src/lib/vote-backup-manager'

async function main() {
  try {
    console.log('🔍 Testing vote integrity...')
    
    const integrity = await voteBackupManager.verifyVoteIntegrity()
    
    console.log('📊 Vote Statistics:')
    console.log(`  Total votes: ${integrity.statistics.totalVotes}`)
    console.log(`  Total ministers: ${integrity.statistics.totalMinisters}`)
    
    if (integrity.statistics.dateRange.earliest && integrity.statistics.dateRange.latest) {
      console.log(`  Date range: ${integrity.statistics.dateRange.earliest.toISOString()} to ${integrity.statistics.dateRange.latest.toISOString()}`)
    }
    
    console.log('📈 Votes per minister:')
    Object.entries(integrity.statistics.votesPerMinister).forEach(([ministerId, count]) => {
      console.log(`  Minister ${ministerId}: ${count} votes`)
    })
    
    if (integrity.isValid) {
      console.log('✅ Vote integrity check passed!')
      process.exit(0)
    } else {
      console.error('❌ Vote integrity check failed!')
      console.error('Issues found:')
      integrity.issues.forEach(issue => console.error(`  - ${issue}`))
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Vote integrity test failed:', error)
    process.exit(1)
  }
}

main()
