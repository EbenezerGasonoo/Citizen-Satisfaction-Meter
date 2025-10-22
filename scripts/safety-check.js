#!/usr/bin/env node

/**
 * Pre-Update Safety Script
 * Run this before any platform updates to ensure vote data is preserved
 */

import { PrismaClient } from '@prisma/client'
import { voteBackupManager } from './src/lib/vote-backup-manager'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function preUpdateSafetyCheck() {
  console.log('🛡️ Starting Pre-Update Safety Check...')
  console.log('=' .repeat(50))

  try {
    // 1. Verify current vote integrity
    console.log('📊 Step 1: Verifying vote integrity...')
    const integrity = await voteBackupManager.verifyVoteIntegrity()
    
    if (!integrity.isValid) {
      console.error('❌ Vote integrity check failed!')
      console.error('Issues found:')
      integrity.issues.forEach(issue => console.error(`  - ${issue}`))
      process.exit(1)
    }
    
    console.log('✅ Vote integrity verified')
    console.log(`📈 Total votes: ${integrity.statistics.totalVotes}`)
    console.log(`👥 Total ministers: ${integrity.statistics.totalMinisters}`)

    // 2. Create backup
    console.log('\n💾 Step 2: Creating vote backup...')
    const backupFile = await voteBackupManager.createBackup()
    console.log(`✅ Backup created: ${backupFile}`)

    // 3. Verify backup integrity
    console.log('\n🔍 Step 3: Verifying backup integrity...')
    const backupMetadata = await voteBackupManager.getBackupMetadata(backupFile)
    
    if (!backupMetadata) {
      console.error('❌ Failed to read backup metadata')
      process.exit(1)
    }

    if (backupMetadata.totalVotes !== integrity.statistics.totalVotes) {
      console.error('❌ Backup vote count mismatch!')
      console.error(`Expected: ${integrity.statistics.totalVotes}, Got: ${backupMetadata.totalVotes}`)
      process.exit(1)
    }

    console.log('✅ Backup integrity verified')
    console.log(`📊 Backup contains ${backupMetadata.totalVotes} votes`)

    // 4. Create update log
    console.log('\n📝 Step 4: Creating update log...')
    const updateLog = {
      timestamp: new Date().toISOString(),
      action: 'pre-update-safety-check',
      voteCount: integrity.statistics.totalVotes,
      ministerCount: integrity.statistics.totalMinisters,
      backupFile: backupFile,
      platformVersion: process.env.npm_package_version || '1.0.0',
      status: 'ready-for-update'
    }

    const logDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const logFile = path.join(logDir, `update-log-${Date.now()}.json`)
    fs.writeFileSync(logFile, JSON.stringify(updateLog, null, 2))
    console.log(`✅ Update log created: ${logFile}`)

    // 5. Final safety check
    console.log('\n🔒 Step 5: Final safety check...')
    const finalVoteCount = await prisma.vote.count()
    
    if (finalVoteCount !== integrity.statistics.totalVotes) {
      console.error('❌ Vote count changed during safety check!')
      console.error(`Expected: ${integrity.statistics.totalVotes}, Got: ${finalVoteCount}`)
      process.exit(1)
    }

    console.log('✅ Final safety check passed')

    // Success message
    console.log('\n' + '=' .repeat(50))
    console.log('🎉 PRE-UPDATE SAFETY CHECK COMPLETED SUCCESSFULLY!')
    console.log('=' .repeat(50))
    console.log(`📊 Votes preserved: ${integrity.statistics.totalVotes}`)
    console.log(`💾 Backup created: ${backupFile}`)
    console.log(`📝 Update log: ${logFile}`)
    console.log('✅ Platform is ready for update')
    console.log('\n⚠️  Remember to run post-update verification after the update!')

  } catch (error) {
    console.error('❌ Pre-update safety check failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function postUpdateVerification() {
  console.log('🔍 Starting Post-Update Verification...')
  console.log('=' .repeat(50))

  try {
    // 1. Verify vote integrity after update
    console.log('📊 Step 1: Verifying vote integrity after update...')
    const integrity = await voteBackupManager.verifyVoteIntegrity()
    
    if (!integrity.isValid) {
      console.error('❌ Vote integrity check failed after update!')
      console.error('Issues found:')
      integrity.issues.forEach(issue => console.error(`  - ${issue}`))
      
      console.log('\n🔄 Attempting to restore from latest backup...')
      const backups = voteBackupManager.getAvailableBackups()
      
      if (backups.length > 0) {
        const latestBackup = backups[0]
        console.log(`📦 Restoring from: ${latestBackup}`)
        await voteBackupManager.restoreBackup(latestBackup)
        
        // Verify restoration
        const restoredIntegrity = await voteBackupManager.verifyVoteIntegrity()
        if (restoredIntegrity.isValid) {
          console.log('✅ Votes restored successfully!')
        } else {
          console.error('❌ Vote restoration failed!')
          process.exit(1)
        }
      } else {
        console.error('❌ No backups available for restoration!')
        process.exit(1)
      }
    } else {
      console.log('✅ Vote integrity verified after update')
      console.log(`📈 Total votes: ${integrity.statistics.totalVotes}`)
    }

    // 2. Create post-update log
    console.log('\n📝 Step 2: Creating post-update log...')
    const postUpdateLog = {
      timestamp: new Date().toISOString(),
      action: 'post-update-verification',
      voteCount: integrity.statistics.totalVotes,
      ministerCount: integrity.statistics.totalMinisters,
      platformVersion: process.env.npm_package_version || '1.0.0',
      status: 'update-completed-successfully'
    }

    const logDir = path.join(process.cwd(), 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }

    const logFile = path.join(logDir, `post-update-log-${Date.now()}.json`)
    fs.writeFileSync(logFile, JSON.stringify(postUpdateLog, null, 2))
    console.log(`✅ Post-update log created: ${logFile}`)

    // Success message
    console.log('\n' + '=' .repeat(50))
    console.log('🎉 POST-UPDATE VERIFICATION COMPLETED SUCCESSFULLY!')
    console.log('=' .repeat(50))
    console.log(`📊 Votes preserved: ${integrity.statistics.totalVotes}`)
    console.log(`📝 Verification log: ${logFile}`)
    console.log('✅ Platform update completed successfully')

  } catch (error) {
    console.error('❌ Post-update verification failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Main execution
const action = process.argv[2]

if (action === 'pre-update') {
  preUpdateSafetyCheck()
} else if (action === 'post-update') {
  postUpdateVerification()
} else {
  console.log('Usage:')
  console.log('  npm run safety-check pre-update   # Run before platform updates')
  console.log('  npm run safety-check post-update  # Run after platform updates')
  process.exit(1)
}
