# ☁️ Nextcloud NAS Backup Configuration Guide

This guide shows you how to configure your Citizen Satisfaction Meter to backup vote data to your Nextcloud NAS.

## 🔧 Configuration

### 1. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Nextcloud Server Configuration
NEXTCLOUD_SERVER_URL=https://your-nextcloud-server.com
NEXTCLOUD_USERNAME=your-username
NEXTCLOUD_PASSWORD=your-password-or-app-password
NEXTCLOUD_BACKUP_PATH=/backups/votes

# Database Configuration (required)
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

### 2. Nextcloud Setup

#### Option A: Use App Password (Recommended)
1. Go to your Nextcloud settings
2. Navigate to **Security** → **App passwords**
3. Create a new app password for "Vote Backup System"
4. Use this app password instead of your main password

#### Option B: Use Regular Password
- Use your regular Nextcloud username and password
- Less secure but simpler setup

### 3. Create Backup Directory

In your Nextcloud, create a folder called `votes` in the root directory:
- Path: `/votes` (or any path you prefer)
- Make sure your user has write permissions

## 🚀 Usage Commands

### Backup to Nextcloud
```bash
# Backup votes to Nextcloud
npm run backup:nextcloud
```

### Restore from Nextcloud
```bash
# List available backups
npm run backup:nextcloud

# Restore from specific backup
npm run restore:nextcloud /backups/votes/votes-backup-2024-01-15T10-30-00.json
```

### Safe Deployment with Nextcloud Backup
```bash
# Deploy with automatic Nextcloud backup
npm run deploy:safe
```

## 📁 Backup Structure

Your Nextcloud will contain backups like this:
```
/backups/votes/
├── votes-backup-2024-01-15T10-30-00.json
├── votes-backup-2024-01-15T14-45-00.json
├── votes-backup-2024-01-16T09-15-00.json
└── ...
```

## 🔍 Testing Your Setup

### 1. Test Connection
```bash
npm run backup:nextcloud
```

If successful, you should see:
```
✅ Nextcloud connection successful!
✅ Backup created and uploaded to Nextcloud successfully!
```

### 2. Verify Backup
Check your Nextcloud web interface to confirm the backup file was uploaded.

## 🛡️ Security Best Practices

### 1. Use App Passwords
- Never use your main Nextcloud password
- Create dedicated app passwords for the backup system
- Rotate app passwords regularly

### 2. Secure Your NAS
- Enable HTTPS on your Nextcloud server
- Use strong passwords
- Keep Nextcloud updated
- Enable two-factor authentication

### 3. Network Security
- Use VPN if accessing from outside your network
- Configure firewall rules appropriately
- Consider using a dedicated backup user account

## 🔄 Automated Backups

### GitHub Actions Integration

Add these secrets to your GitHub repository:
- `NEXTCLOUD_SERVER_URL`
- `NEXTCLOUD_USERNAME`
- `NEXTCLOUD_PASSWORD`
- `NEXTCLOUD_BACKUP_PATH`

The deployment workflow will automatically backup to Nextcloud.

### Cron Job (Linux/Mac)

Add to your crontab for daily backups:
```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/your/project && npm run backup:nextcloud
```

### Windows Task Scheduler

Create a scheduled task to run:
```cmd
cd C:\path\to\your\project && npm run backup:nextcloud
```

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test connection manually
curl -u username:password "https://your-nextcloud.com/remote.php/dav/files/username/"
```

### Permission Issues
- Check that your user has write permissions to the backup directory
- Verify the backup path exists in Nextcloud

### SSL Certificate Issues
- Ensure your Nextcloud server has a valid SSL certificate
- For self-signed certificates, you may need to add `NODE_TLS_REJECT_UNAUTHORIZED=0` (not recommended for production)

### Large Backup Files
- Nextcloud has file size limits (default 512MB)
- If backups are too large, consider compressing them or splitting them

## 📊 Monitoring

### Check Backup Status
```bash
# List all backups on Nextcloud
npm run backup:nextcloud
```

### Verify Backup Integrity
```bash
# Test vote integrity after restoration
npm run test:vote-integrity
```

## 🔄 Backup Rotation

The system automatically keeps the last 10 backups on Nextcloud. You can change this by modifying the cleanup function:

```typescript
// In nextcloud-backup-manager.ts
await nextcloudManager.cleanupOldBackups(20) // Keep last 20 backups
```

## 📞 Support

If you encounter issues:

1. **Check Nextcloud logs** for server-side errors
2. **Verify credentials** and permissions
3. **Test connection** manually with curl
4. **Check network connectivity** to your NAS
5. **Review backup file sizes** (should be reasonable)

---

**Your votes are now safely backed up to your NAS! 🎉**
