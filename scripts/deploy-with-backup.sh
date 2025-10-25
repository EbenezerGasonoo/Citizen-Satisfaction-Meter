#!/bin/bash

# Deploy with Vote Backup Script
# This script ensures votes are backed up before any deployment

set -e  # Exit on any error

echo "🚀 Starting deployment with vote backup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Create vote backup
print_status "Creating vote backup before deployment..."
npm run backup:votes

if [ $? -ne 0 ]; then
    print_error "Vote backup failed! Deployment aborted."
    exit 1
fi

# Step 1.5: Backup to Nextcloud (if configured)
if [ ! -z "$NEXTCLOUD_SERVER_URL" ]; then
    print_status "Uploading backup to Nextcloud..."
    npm run backup:nextcloud
    
    if [ $? -ne 0 ]; then
        print_warning "Nextcloud backup failed, but local backup exists. Continuing..."
    fi
fi

# Step 2: Verify backup was created
BACKUP_DIR="./backups/votes"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/votes-backup-*.json 2>/dev/null | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
    print_error "No backup file found! Deployment aborted."
    exit 1
fi

print_status "Backup created: $LATEST_BACKUP"

# Step 3: Run pre-deployment checks
print_status "Running pre-deployment checks..."
npm run test:vote-integrity

if [ $? -ne 0 ]; then
    print_error "Vote integrity check failed! Deployment aborted."
    exit 1
fi

# Step 4: Build the application
print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed! Deployment aborted."
    exit 1
fi

# Step 5: Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    print_error "Deployment failed!"
    print_warning "Votes are safely backed up in: $LATEST_BACKUP"
    exit 1
fi

# Step 6: Post-deployment verification
print_status "Running post-deployment verification..."
sleep 10  # Wait for deployment to complete

# Check if the API is responding
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://citizenmeter.vercel.app/api/analytics/nationalScore)

if [ "$API_RESPONSE" != "200" ]; then
    print_error "API not responding after deployment!"
    print_warning "Votes are safely backed up in: $LATEST_BACKUP"
    exit 1
fi

# Step 7: Verify vote count after deployment
print_status "Verifying vote count after deployment..."
VOTE_COUNT=$(curl -s https://citizenmeter.vercel.app/api/analytics/nationalScore | jq -r '.totalVotes')

if [ "$VOTE_COUNT" = "null" ] || [ -z "$VOTE_COUNT" ]; then
    print_error "Could not retrieve vote count after deployment!"
    print_warning "Votes are safely backed up in: $LATEST_BACKUP"
    exit 1
fi

print_status "Deployment successful! Current vote count: $VOTE_COUNT"

# Step 8: Clean up old backups (keep last 10)
print_status "Cleaning up old backups..."
npm run cleanup:backups

print_status "🎉 Deployment completed successfully!"
print_status "📊 Current vote count: $VOTE_COUNT"
print_status "💾 Latest backup: $LATEST_BACKUP"

echo ""
echo "📋 Deployment Summary:"
echo "  ✅ Vote backup created"
echo "  ✅ Pre-deployment checks passed"
echo "  ✅ Application built successfully"
echo "  ✅ Deployed to Vercel"
echo "  ✅ Post-deployment verification passed"
echo "  ✅ Vote count verified: $VOTE_COUNT"
echo ""
