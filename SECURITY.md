# 🔒 Security Guidelines

## Environment Variables and Secrets Management

### ⚠️ CRITICAL SECURITY RULES

1. **NEVER commit `.env` files to version control**
   - All `.env*` files (except `.env.example`) should be in `.gitignore`
   - Use `.env.example` as a template with placeholder values only

2. **If you accidentally commit secrets:**
   ```bash
   # Immediately revoke all exposed credentials
   # Then remove from git history:
   git filter-branch --index-filter 'git rm --cached --ignore-unmatch .env' HEAD
   git push origin --force-with-lease --all
   ```

3. **Setting up environment variables:**
   ```bash
   # Copy the example file
   cp backend/.env.example backend/.env
   
   # Edit with your actual credentials
   nano backend/.env  # or use your preferred editor
   ```

### 🔑 Secret Rotation Schedule

- **JWT Secrets**: Rotate monthly in production
- **Database Passwords**: Rotate quarterly
- **API Keys**: Rotate when team members leave
- **DigitalOcean Keys**: Rotate quarterly

### 📋 Security Checklist

- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] Production secrets are different from development
- [ ] Regular secret rotation schedule in place
- [ ] Team members know not to commit `.env` files

### 🚨 If Secrets Are Compromised

1. **Immediately revoke/rotate all exposed credentials**
2. **Check git history for any commits containing secrets**
3. **Update all environments with new credentials**
4. **Monitor for unusual activity**
5. **Document the incident**

## Secure Development Practices

### Environment-Specific Configuration

- **Development**: Use local database and test API keys
- **Staging**: Use staging environment with limited permissions
- **Production**: Use production secrets with full security

### Code Review Requirements

- All environment variable changes must be reviewed
- No secrets in pull request descriptions or comments
- Verify `.env.example` is updated when new variables are added

## Contact

If you discover a security vulnerability, please report it to: security@skillmatch.ai
