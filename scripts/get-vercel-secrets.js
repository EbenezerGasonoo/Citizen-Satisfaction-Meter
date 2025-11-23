#!/usr/bin/env node

/**
 * Script to help retrieve Vercel credentials for GitHub Actions
 * 
 * This script will help you get:
 * - VERCEL_TOKEN
 * - VERCEL_ORG_ID
 * - VERCEL_PROJECT_ID
 */

console.log('🔍 Vercel Credentials Helper\n')
console.log('This script will help you get your Vercel credentials for GitHub Actions.\n')

console.log('📋 Step-by-step instructions:\n')

console.log('1️⃣  VERCEL_TOKEN:')
console.log('   - Go to: https://vercel.com/account/tokens')
console.log('   - Click "Create Token"')
console.log('   - Give it a name (e.g., "GitHub Actions")')
console.log('   - Copy the token (you\'ll only see it once!)\n')

console.log('2️⃣  VERCEL_ORG_ID:')
console.log('   - Go to: https://vercel.com/account')
console.log('   - Look at the URL or check your team settings')
console.log('   - Or run: npx vercel whoami\n')

console.log('3️⃣  VERCEL_PROJECT_ID:')
console.log('   - Go to your project: https://vercel.com/[your-team]/citizenmeter')
console.log('   - Go to Settings → General')
console.log('   - Find "Project ID" in the project settings\n')

console.log('📝 After getting all three values:')
console.log('   1. Go to your GitHub repository')
console.log('   2. Settings → Secrets and variables → Actions')
console.log('   3. Click "New repository secret"')
console.log('   4. Add each secret:\n')
console.log('      Name: VERCEL_TOKEN')
console.log('      Value: [paste your token]\n')
console.log('      Name: VERCEL_ORG_ID')
console.log('      Value: [paste your org ID]\n')
console.log('      Name: VERCEL_PROJECT_ID')
console.log('      Value: [paste your project ID]\n')

console.log('💡 Alternative: Use Vercel CLI\n')
console.log('   If you have Vercel CLI installed:')
console.log('   1. Run: npx vercel link')
console.log('   2. This will create a .vercel folder with project.json')
console.log('   3. Check .vercel/project.json for orgId and projectId\n')

// Try to check if vercel CLI is available
const { execSync } = require('child_process')

try {
  console.log('\n🔧 Checking for Vercel CLI...\n')
  const whoami = execSync('npx vercel whoami', { encoding: 'utf8', stdio: 'pipe' })
  console.log('✅ Vercel CLI is available!')
  console.log(`   Logged in as: ${whoami.trim()}\n`)
  
  console.log('📦 Attempting to link project...\n')
  console.log('   Run: npx vercel link')
  console.log('   This will create .vercel/project.json with your IDs\n')
} catch (error) {
  console.log('⚠️  Vercel CLI not found or not logged in')
  console.log('   Install it with: npm i -g vercel')
  console.log('   Or use npx: npx vercel login\n')
}

console.log('✨ Once you\'ve added all three secrets to GitHub, your workflow will work!\n')

