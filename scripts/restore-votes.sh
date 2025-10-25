#!/bin/bash

# Emergency Vote Restoration Script
# Use this if votes are lost during deployment

set -e

echo "🚨 Emergency Vote Restoration Script"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if backup directory exists
BACKUP_DIR="./backups/votes"
if [ ! -d "$BACKUP_DIR" ]; then
    print_error "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

# List available backups
echo "📁 Available backups:"
ls -la $BACKUP_DIR/votes-backup-*.json 2>/dev/null || {
    print_error "No backup files found!"
    exit 1
}

echo ""
echo "Please select a backup to restore:"
echo ""

# Show backup options
BACKUPS=($(ls -t $BACKUP_DIR/votes-backup-*.json))
for i in "${!BACKUPS[@]}"; do
    BACKUP_FILE="${BACKUPS[$i]}"
    BACKUP_DATE=$(stat -c %y "$BACKUP_FILE" 2>/dev/null || stat -f %Sm "$BACKUP_FILE")
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo "$((i+1)). $BACKUP_FILE"
    echo "   📅 Date: $BACKUP_DATE"
    echo "   📊 Size: $BACKUP_SIZE"
    echo ""
done

# Get user selection
read -p "Enter backup number (1-${#BACKUPS[@]}): " SELECTION

if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt "${#BACKUPS[@]}" ]; then
    print_error "Invalid selection!"
    exit 1
fi

SELECTED_BACKUP="${BACKUPS[$((SELECTION-1))]}"

echo ""
print_warning "You are about to restore votes from:"
echo "   📁 $SELECTED_BACKUP"
echo ""
print_warning "This will REPLACE all current votes in the database!"
echo ""

read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    print_error "Restoration cancelled."
    exit 1
fi

# Create a backup of current state before restoration
print_status "Creating backup of current state..."
CURRENT_BACKUP="$BACKUP_DIR/pre-restore-backup-$(date +%Y%m%d-%H%M%S).json"
npm run backup:votes -- --output "$CURRENT_BACKUP"

# Restore the selected backup
print_status "Restoring votes from backup..."
npm run restore:votes -- "$SELECTED_BACKUP"

if [ $? -ne 0 ]; then
    print_error "Restoration failed!"
    print_warning "Current state backed up to: $CURRENT_BACKUP"
    exit 1
fi

# Verify restoration
print_status "Verifying restoration..."
sleep 5

VOTE_COUNT=$(curl -s https://citizenmeter.vercel.app/api/analytics/nationalScore | jq -r '.totalVotes')

if [ "$VOTE_COUNT" = "null" ] || [ -z "$VOTE_COUNT" ]; then
    print_error "Could not verify vote count after restoration!"
    exit 1
fi

print_status "🎉 Vote restoration completed successfully!"
print_status "📊 Restored vote count: $VOTE_COUNT"
print_status "💾 Pre-restore backup: $CURRENT_BACKUP"

echo ""
echo "📋 Restoration Summary:"
echo "  ✅ Current state backed up"
echo "  ✅ Votes restored from: $SELECTED_BACKUP"
echo "  ✅ Vote count verified: $VOTE_COUNT"
echo "  ✅ System is operational"
echo ""
