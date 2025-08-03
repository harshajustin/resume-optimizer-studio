# 🚀 Secure Deployment Guide

## ⚠️ SECURITY FIRST

Before deploying, ensure you have:
- [ ] Rotated all credentials that were exposed in git history
- [ ] Generated new secrets for production
- [ ] Reviewed all deployment scripts for hardcoded credentials

## Deployment Process

### 1. Prepare Your Droplet

```bash
# Run the setup script (creates template .env)
chmod +x backend/setup_droplet.sh
./backend/setup_droplet.sh
```

### 2. CRITICAL: Update Environment Variables

The setup script creates a template `.env` file. You MUST edit it:

```bash
cd /opt/skillmatch/resume-optimizer-studio/backend
nano .env  # Replace ALL placeholder values
```

**Required Updates:**
- `DATABASE_URL`: Your actual PostgreSQL connection string
- `JWT_SECRET_KEY`: Generate new with `openssl rand -hex 32`
- `DO_SPACES_ACCESS_KEY`: Your DigitalOcean Spaces access key
- `DO_SPACES_SECRET_KEY`: Your DigitalOcean Spaces secret key
- `ALLOWED_ORIGINS`: Your actual domain

### 3. Verify Security

```bash
# Check that .env is not world-readable
ls -la .env
# Should show: -rw------- (only owner can read/write)

# If not, fix permissions:
chmod 600 .env
```

### 4. Test Deployment

```bash
# Check service status
sudo systemctl status skillmatch-backend

# View logs
sudo journalctl -u skillmatch-backend -f

# Test API
curl http://localhost:8000/health
```

## Security Checklist for Deployment

- [ ] All credentials rotated from any that were in git history
- [ ] `.env` file has correct permissions (600)
- [ ] Service running as non-root user
- [ ] Firewall configured (only allow ports 22, 80, 443)
- [ ] SSL certificate installed (use Let's Encrypt)
- [ ] Database connections use SSL
- [ ] Regular security updates scheduled

## Production Hardening

### SSL/HTTPS Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Deny all other inbound traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### Monitoring Setup

```bash
# View real-time logs
sudo journalctl -u skillmatch-backend -f

# Check system resources
htop

# Monitor disk space
df -h
```

## Emergency Procedures

### If Credentials Are Compromised

1. **Immediately rotate all credentials**
2. **Restart services with new credentials**
3. **Check logs for unauthorized access**
4. **Update monitoring/alerts**

### Backup and Recovery

```bash
# Backup environment config (without secrets)
cp .env .env.backup.$(date +%Y%m%d)

# Database backup (if using managed DB, use provider's backup)
# For self-hosted PostgreSQL:
pg_dump -h localhost -U username dbname > backup.sql
```

## Contact

For deployment issues or security concerns: security@skillmatch.ai
