# 🔧 Environment Setup Guide

## Quick Setup

1. **Copy environment template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Edit with your actual credentials:**
   ```bash
   nano backend/.env  # Replace ALL placeholder values
   ```

3. **Verify .env is ignored:**
   ```bash
   git status  # Should NOT show .env as a tracked file
   ```

## Required Environment Variables

### 🗄️ Database Configuration
```bash
DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
```
- Get from your PostgreSQL provider (DigitalOcean, AWS RDS, etc.)

### 🔐 JWT Authentication
```bash
JWT_SECRET_KEY=your-super-secure-random-string-here
```
- Generate with: `openssl rand -hex 32`

### ☁️ DigitalOcean Spaces (File Storage)
```bash
DO_SPACES_ACCESS_KEY=your-access-key
DO_SPACES_SECRET_KEY=your-secret-key
DO_SPACES_BUCKET_NAME=your-bucket-name
```
- Get from DigitalOcean Spaces dashboard

### 🤖 AI Configuration
```bash
OPENAI_API_KEY=sk-your-openai-api-key
```
- Get from OpenAI dashboard

### 📧 Email Configuration (Optional)
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-app-password
```

## Security Reminders

⚠️ **NEVER commit `.env` files to git**
⚠️ **Use different secrets for development/production**
⚠️ **Rotate secrets regularly**
⚠️ **Never share secrets in chat/email**

## Troubleshooting

**Backend won't start?**
- Check if all required variables are set in `.env`
- Verify database connection string
- Ensure JWT_SECRET_KEY is set

**File uploads failing?**
- Verify DigitalOcean Spaces credentials
- Check bucket permissions
- Confirm endpoint URLs are correct
