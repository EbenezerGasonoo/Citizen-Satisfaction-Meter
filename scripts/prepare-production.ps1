# Prepare Production Deployment Script (PowerShell)
# This script prepares your app for production deployment on Windows

Write-Host "🚀 Preparing for production deployment..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "Creating .env from env.example..."
    Copy-Item env.example .env
    Write-Host "⚠️  Please edit .env file with your actual values" -ForegroundColor Yellow
    exit 1
}

# Check if DATABASE_URL is set
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "postgresql://") {
    Write-Host "❌ DATABASE_URL not configured properly" -ForegroundColor Red
    Write-Host "Please update DATABASE_URL in .env file with your Railway PostgreSQL URL"
    exit 1
}

# Check if NEXTAUTH_SECRET is set
if ($envContent -match "generate-a-secure-random-string-here") {
    Write-Host "⚠️  Generating NEXTAUTH_SECRET..." -ForegroundColor Yellow
    $bytes = New-Object Byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $secret = [Convert]::ToBase64String($bytes)
    (Get-Content .env) -replace 'generate-a-secure-random-string-here', $secret | Set-Content .env
    Write-Host "✅ NEXTAUTH_SECRET generated" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Installing dependencies..."
npm install

Write-Host ""
Write-Host "🔄 Updating Prisma schema for PostgreSQL..."
if (Test-Path prisma/schema-production.prisma) {
    Copy-Item prisma/schema.prisma prisma/schema-sqlite-backup.prisma -ErrorAction SilentlyContinue
    Copy-Item prisma/schema-production.prisma prisma/schema.prisma -Force
    Write-Host "✅ Schema updated" -ForegroundColor Green
} else {
    Write-Host "⚠️  schema-production.prisma not found, skipping..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔨 Generating Prisma Client..."
npx prisma generate

Write-Host ""
Write-Host "📊 Pushing schema to database..."
npx prisma db push --skip-generate

Write-Host ""
Write-Host "🌱 Seeding database..."
npm run db:seed

Write-Host ""
Write-Host "🏗️  Building application..."
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Commit and push your changes:"
    Write-Host "   git add ."
    Write-Host "   git commit -m 'Prepare for production'"
    Write-Host "   git push origin main"
    Write-Host ""
    Write-Host "2. Deploy to Vercel:"
    Write-Host "   - Go to https://vercel.com"
    Write-Host "   - Import your GitHub repository"
    Write-Host "   - Add environment variables from .env file"
    Write-Host "   - Deploy!"
    Write-Host ""
    Write-Host "See DEPLOYMENT.md for detailed instructions"
} else {
    Write-Host ""
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Please fix errors and try again"
    exit 1
}

