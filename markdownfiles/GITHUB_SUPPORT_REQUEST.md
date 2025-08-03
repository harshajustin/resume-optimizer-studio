# GitHub Support Request Template

## Security Incident: Remove Exposed Credentials from Pull Request References

**Repository**: harshajustin/resume-optimizer-studio
**Issue**: Exposed production credentials in git history and GitHub pull request references
**Urgency**: HIGH - Production credentials exposed

### Problem Description:
Production credentials were accidentally committed to our repository and are still accessible through GitHub's pull request reference system, specifically:
- `refs/pull/1/head` contains commit `7ecc31d913ca2ee8414d567957c3bfbb8dee772a`
- This commit contains exposed PostgreSQL and DigitalOcean Spaces credentials

### Actions Already Taken:
1. ✅ All credentials have been rotated
2. ✅ Used BFG Repo-Cleaner to clean all branch history
3. ✅ Force-pushed cleaned repository
4. ✅ Removed credentials from all current files
5. ✅ Enhanced .gitignore to prevent future leaks

### Current Issue:
Despite cleaning all branches, GitGuardian security scanner still detects credentials in:
- `commit://7ecc31d913ca2ee8414d567957c3bfbb8dee772a`
- `commit://492fe543455d2b69aa96903dc125ed5394b82ade`  
- `commit://b7a0e54042421b22b0b0c341c62233bc3f512ed7`

These commits exist in GitHub's pull request reference system and cannot be removed via git push.

### Request:
Please permanently purge these commits and all related references from GitHub's system to complete our security remediation.

### Exposed Credentials (NOW ROTATED):
- PostgreSQL database password: AVNS_MKce1Vjgkjn1wl5XYuP (ROTATED)
- DigitalOcean Spaces keys: DO00MQV9RCFQHM9H37CE (ROTATED)
- JWT secret key: skillmatch-super-secret-jwt-key-2025-production-ready-key (ROTATED)

**All credentials have been rotated and are no longer valid, but we need complete removal from GitHub's system for security compliance.**

### Additional Technical Details:
- **GitGuardian Incident URLs**: 
  - https://dashboard.gitguardian.com/workspace/617574/incidents/19533947
  - https://dashboard.gitguardian.com/workspace/617574/incidents/19533948
- **Affected Files**: `backend/app.yaml`, `backend/.env.example`, `backend/setup_droplet.sh`
- **Security Scanner**: GitGuardian continues to detect these commits despite branch cleanup

### How to Contact GitHub Support:
1. Go to: https://support.github.com/contact
2. Select "Account and Repository" → "Repository Issues" → "Security"
3. Reference this repository: `harshajustin/resume-optimizer-studio`
4. Include the commit hashes: `7ecc31d913ca2ee8414d567957c3bfbb8dee772a`, `492fe543455d2b69aa96903dc125ed5394b82ade`, `b7a0e54042421b22b0b0c341c62233bc3f512ed7`

### Expected Resolution:
GitHub Support should permanently purge these commits from all internal references, including pull request refs, which will resolve all remaining GitGuardian security alerts.
