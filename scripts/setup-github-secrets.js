#!/usr/bin/env node

/**
 * Script to display Vercel credentials for GitHub Secrets setup
 */

const fs = require('fs')
const path = require('path')

console.log('🔐 Vercel Credentials for GitHub Secrets\n')
console.log('=' .repeat(50) + '\n')

// Read project.json
const projectJsonPath = path.join(__dirname, '..', '.vercel', 'project.json')

if (!fs.existsSync(projectJsonPath)) {
  console.log('❌ .vercel/project.json not found!')
  console.log('   Run: npx vercel link\n')
  process.exit(1)
}

const projectConfig = JSON.parse(fs.readFileSync(projectJsonPath, 'utf8'))

console.log('✅ Found Vercel project configuration!\n')

console.log('📋 Here are your Vercel credentials:\n')

console.log('1️⃣  VERCEL_ORG_ID:')
console.log(`   ${projectConfig.orgId}\n`)

console.log('2️⃣  VERCEL_PROJECT_ID:')
console.log(`   ${projectConfig.projectId}\n`)

console.log('3️⃣  VERCEL_TOKEN:')
console.log('   ⚠️  You need to create this manually:')
console.log('   1. Go to: https://vercel.com/account/tokens')
console.log('   2. Click "Create Token"')
console.log('   3. Name it: "GitHub Actions"')
console.log('   4. Copy the token (you\'ll only see it once!)\n')

console.log('=' .repeat(50))
console.log('\n📝 Next Steps:\n')
console.log('1. Get your VERCEL_TOKEN from the link above\n')
console.log('2. Go to your GitHub repository:')
console.log('   https://github.com/[your-username]/[your-repo]/settings/secrets/actions\n')
console.log('3. Click "New repository secret" and add:\n')
console.log(`   Name: VERCEL_ORG_ID`)
console.log(`   Value: ${projectConfig.orgId}\n`)
console.log(`   Name: VERCEL_PROJECT_ID`)
console.log(`   Value: ${projectConfig.projectId}\n`)
console.log(`   Name: VERCEL_TOKEN`)
console.log(`   Value: [paste your token from step 1]\n`)
console.log('4. After adding all three secrets, your GitHub Actions workflow will work! ✅\n')

// Also create a file with the values (excluding token)
const secretsFile = path.join(__dirname, '..', '.github-secrets-template.txt')
const template = `# GitHub Secrets Template
# Add these to: https://github.com/[your-username]/[your-repo]/settings/secrets/actions

VERCEL_ORG_ID=${projectConfig.orgId}
VERCEL_PROJECT_ID=${projectConfig.projectId}
VERCEL_TOKEN=[Get from https://vercel.com/account/tokens]
`

fs.writeFileSync(secretsFile, template)
console.log(`💾 Template saved to: .github-secrets-template.txt\n`)

