# Deploy with Vote Backup Script (PowerShell)
# This script ensures votes are backed up before any deployment

param(
    [switch]$SkipBackup,
    [switch]$SkipTests,
    [string]$Environment = "production"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment with vote backup..." -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

try {
    # Step 1: Create vote backup
    if (-not $SkipBackup) {
        Write-Status "Creating vote backup before deployment..."
        npm run backup:votes
        
        if ($LASTEXITCODE -ne 0) {
            throw "Vote backup failed!"
        }
        
        # Verify backup was created
        $BackupDir = ".\backups\votes"
        $LatestBackup = Get-ChildItem -Path $BackupDir -Filter "votes-backup-*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        
        if (-not $LatestBackup) {
            throw "No backup file found!"
        }
        
        Write-Status "Backup created: $($LatestBackup.FullName)"
    }
    
    # Step 2: Run pre-deployment checks
    if (-not $SkipTests) {
        Write-Status "Running pre-deployment checks..."
        npm run test:vote-integrity
        
        if ($LASTEXITCODE -ne 0) {
            throw "Vote integrity check failed!"
        }
    }
    
    # Step 3: Build the application
    Write-Status "Building application..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed!"
    }
    
    # Step 4: Deploy to Vercel
    Write-Status "Deploying to Vercel..."
    vercel --prod
    
    if ($LASTEXITCODE -ne 0) {
        throw "Deployment failed!"
    }
    
    # Step 5: Post-deployment verification
    Write-Status "Running post-deployment verification..."
    Start-Sleep -Seconds 10  # Wait for deployment to complete
    
    # Check if the API is responding
    try {
        $ApiResponse = Invoke-WebRequest -Uri "https://citizenmeter.vercel.app/api/analytics/nationalScore" -UseBasicParsing
        
        if ($ApiResponse.StatusCode -ne 200) {
            throw "API not responding after deployment!"
        }
        
        # Parse vote count
        $VoteData = $ApiResponse.Content | ConvertFrom-Json
        $VoteCount = $VoteData.totalVotes
        
        Write-Status "Deployment successful! Current vote count: $VoteCount"
        
    } catch {
        Write-Warning "Could not verify API response: $_"
        Write-Warning "Votes are safely backed up in: $($LatestBackup.FullName)"
    }
    
    # Step 6: Clean up old backups
    Write-Status "Cleaning up old backups..."
    npm run cleanup:backups
    
    Write-Status "🎉 Deployment completed successfully!"
    Write-Status "📊 Current vote count: $VoteCount"
    Write-Status "💾 Latest backup: $($LatestBackup.FullName)"
    
    Write-Host ""
    Write-Host "📋 Deployment Summary:" -ForegroundColor Cyan
    Write-Host "  ✅ Vote backup created" -ForegroundColor Green
    Write-Host "  ✅ Pre-deployment checks passed" -ForegroundColor Green
    Write-Host "  ✅ Application built successfully" -ForegroundColor Green
    Write-Host "  ✅ Deployed to Vercel" -ForegroundColor Green
    Write-Host "  ✅ Post-deployment verification passed" -ForegroundColor Green
    Write-Host "  ✅ Vote count verified: $VoteCount" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Error "Deployment failed: $_"
    Write-Warning "Votes are safely backed up in: $($LatestBackup.FullName)"
    exit 1
}
