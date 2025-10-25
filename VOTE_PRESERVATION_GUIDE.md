# 🛡️ Vote Preservation & Safe Deployment Guide

This guide ensures that votes are never lost during deployments and updates.

## 🚨 Critical: Always Backup Before Deploying!

**NEVER deploy without creating a vote backup first!**

## 📋 Quick Commands

### Safe Deployment (Recommended)
```bash
# Use the automated safe deployment script
npm run deploy:safe
```

### Manual Backup & Deploy
```bash
# 1. Create backup
npm run backup:votes

# 2. Test integrity
npm run test:vote-integrity

# 3. Build and deploy
npm run build
vercel --prod

# 4. Verify deployment
curl https://citizenmeter.vercel.app/api/analytics/nationalScore
```

### Emergency Vote Restoration
```bash
# If votes are lost during deployment
npm run restore:emergency
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run backup:votes` | Create a complete vote backup |
| `npm run restore:votes <file>` | Restore votes from backup file |
| `npm run test:vote-integrity` | Verify vote data integrity |
| `npm run cleanup:backups` | Clean up old backups (keep last 10) |
| `npm run deploy:safe` | Safe deployment with automatic backup |
| `npm run restore:emergency` | Emergency restoration script |

## 📁 Backup Locations

- **Local backups**: `./backups/votes/`
- **GitHub Actions**: Stored as artifacts for 30 days
- **Cloud storage**: If `CLOUD_BACKUP_URL` is configured

## 🚀 Deployment Workflow

### 1. Pre-Deployment Checklist
- [ ] Create vote backup
- [ ] Test vote integrity
- [ ] Verify database connection
- [ ] Check for pending migrations

### 2. Deployment Process
- [ ] Run safe deployment script
- [ ] Monitor deployment logs
- [ ] Verify API health after deployment
- [ ] Check vote count matches backup

### 3. Post-Deployment Verification
- [ ] API responds correctly
- [ ] Vote count is preserved
- [ ] All features work as expected
- [ ] Clean up old backups

## 🆘 Emergency Procedures

### If Votes Are Lost During Deployment

1. **Stop all traffic** (if possible)
2. **Run emergency restoration**:
   ```bash
   npm run restore:emergency
   ```
3. **Select the most recent backup**
4. **Verify restoration**:
   ```bash
   curl https://citizenmeter.vercel.app/api/analytics/nationalScore
   ```
5. **Test the application** to ensure everything works

### If Backup Files Are Missing

1. **Check GitHub Actions artifacts** (if using CI/CD)
2. **Check cloud storage** (if configured)
3. **Check local backup directory**: `./backups/votes/`
4. **Contact system administrator** if no backups found

## 🔍 Monitoring & Alerts

### Key Metrics to Monitor
- Vote count consistency
- API response times
- Database connection health
- Backup creation success

### Automated Checks
- Vote integrity verification
- API health checks
- Backup file validation
- Deployment verification

## 📊 Backup Strategy

### Backup Frequency
- **Before every deployment** (automatic)
- **Daily** (if configured)
- **Before major updates**

### Backup Retention
- **Local**: Keep last 10 backups
- **Cloud**: Keep last 30 days
- **GitHub Actions**: Keep last 30 days

### Backup Validation
- Vote count verification
- Data integrity checks
- Minister reference validation
- Date range verification

## 🛠️ Configuration

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://...

# Optional
CLOUD_BACKUP_URL=https://your-cloud-storage.com/backups
BACKUP_RETENTION_DAYS=30
```

### GitHub Secrets (for CI/CD)
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
DATABASE_URL=your_database_url
CLOUD_BACKUP_URL=your_cloud_backup_url
```

## 📞 Support

If you encounter issues with vote preservation:

1. **Check the logs** for error messages
2. **Verify backup files** exist and are valid
3. **Test vote integrity** with `npm run test:vote-integrity`
4. **Contact the development team** with:
   - Error logs
   - Backup file locations
   - Deployment timestamp
   - Current vote count

## ✅ Best Practices

1. **Always backup before deploying**
2. **Test backups regularly**
3. **Monitor vote counts after deployment**
4. **Keep multiple backup copies**
5. **Document any manual interventions**
6. **Train team members on emergency procedures**

---

**Remember: Votes represent citizen engagement and trust. Never risk losing them!**
