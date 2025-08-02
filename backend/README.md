# 🎯 SkillMatch AI Backend

> **Next-generation FastAPI backend for AI-powered resume optimization with enterprise-grade DigitalOcean Spaces integration**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-00a1f1?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.13+-3776ab?style=flat-square&logo=python)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=flat-square&logo=docker)](https://docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

## 🌟 Overview

SkillMatch AI Backend is a high-performance, scalable API service that powers intelligent resume optimization. Built with modern Python technologies, it provides seamless file processing, AI-driven content analysis, and enterprise-grade security features.

### ✨ Key Highlights

- 🚀 **Ultra-Fast**: Built on FastAPI with async/await throughout
- 🔒 **Enterprise Security**: JWT authentication, RLS, and GDPR compliance
- 📁 **Smart Storage**: DigitalOcean Spaces with CDN integration
- 🤖 **AI-Powered**: OpenAI and LangChain integration for content analysis
- 📊 **Production Ready**: Comprehensive logging, monitoring, and error handling
- 🔄 **Real-time**: WebSocket support and background task processing
- 🐳 **Container Native**: Full Docker and Docker Compose support

## 🏗️ Architecture

```mermaid
graph TB
    A[React Frontend] --> B[FastAPI Backend]
    B --> C[PostgreSQL 14+]
    B --> D[DigitalOcean Spaces]
    B --> E[Redis Cache]
    B --> F[OpenAI API]
    B --> G[Celery Workers]
    G --> E
    B --> H[Structured Logging]
```

## 🚀 Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Row-Level Security (RLS) for data isolation
- CORS configuration for production
- Rate limiting and request validation
- Secure file upload with type validation

### 📁 **File Management**
- DigitalOcean Spaces integration with CDN
- Presigned URLs for secure file access
- Automatic file versioning and metadata
- GDPR-compliant data retention policies
- Support for PDF, DOCX, and TXT formats

### 🤖 **AI & Processing**
- OpenAI GPT integration for content analysis
- LangChain for advanced text processing
- Resume parsing and skill extraction
- Job matching algorithms
- Background task processing with Celery

### 📊 **Database & Storage**
- PostgreSQL with advanced indexing
- Audit logging with partitioning
- Materialized views for analytics
- Connection pooling and optimization
- Automatic backup strategies

### 🔍 **Monitoring & Observability**
- Structured logging with correlation IDs
- Health check endpoints
- Performance metrics collection
- Error tracking and alerting
- Request/response tracing

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | FastAPI | 0.110+ | High-performance async web framework |
| **Language** | Python | 3.13+ | Modern Python with latest features |
| **Database** | PostgreSQL | 14+ | Production-grade relational database |
| **ORM** | SQLAlchemy | 2.0+ | Async database operations |
| **Storage** | DigitalOcean Spaces | - | S3-compatible object storage with CDN |
| **Cache** | Redis | 6+ | In-memory caching and session storage |
| **Authentication** | python-jose | 3.3+ | JWT token handling |
| **File Processing** | PyPDF2, python-docx | Latest | Document parsing and processing |
| **AI/ML** | OpenAI, LangChain | Latest | AI-powered content analysis |
| **Task Queue** | Celery | 5.3+ | Background job processing |
| **Logging** | Structlog | 24+ | Structured application logging |
| **Validation** | Pydantic | 2.8+ | Data validation and serialization |
| **Testing** | Pytest | 8+ | Comprehensive testing framework |

## 📋 Prerequisites

### System Requirements
- **Python**: 3.13+ (recommended) or 3.11+
### System Requirements
- **Python**: 3.13+ (recommended) or 3.11+
- **PostgreSQL**: 14+ (tested with 14.18)
- **Redis**: 6+ (for caching and task queue)
- **libmagic**: For file type detection (`brew install libmagic` on macOS)
- **Git**: For version control

### External Services
- **DigitalOcean Spaces**: Account with API credentials
- **OpenAI API**: Account with API key for AI features
- **Optional**: Sentry account for error tracking

### Development Tools
- **Docker & Docker Compose**: For containerized development (optional)
- **PostgreSQL Client**: `psql` for database management
- **Code Editor**: VS Code recommended with Python extensions

## ⚡ Quick Start

### 1. � Clone and Setup

```bash
# Clone the repository
git clone https://github.com/harshajustin/resume-optimizer-studio.git
cd resume-optimizer-studio/backend

# Create and activate virtual environment
python3.13 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. 🔧 Database Setup

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql@14  # macOS
# sudo apt-get install postgresql-14  # Ubuntu
# Or use Docker: docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14

# Start PostgreSQL service
brew services start postgresql@14

# Create database and user
createuser -s postgres
createdb skillmatch_dev
psql -d skillmatch_dev -c "ALTER USER postgres PASSWORD 'password';"

# Run migrations to create schema
psql -h localhost -U postgres -d skillmatch_dev -f migration.sql
```

### 3. 🌍 Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configurations
nano .env  # or use your preferred editor
```

### 4. 🚀 Launch Application

```bash
# Activate virtual environment (if not already active)
source venv/bin/activate

# Start the FastAPI server
venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. ✅ Verify Installation

Visit these URLs to confirm everything is working:

- 📖 **API Documentation**: http://localhost:8000/docs
- 🔍 **Alternative Docs**: http://localhost:8000/redoc
- ❤️ **Health Check**: http://localhost:8000/health

## 🔧 Detailed Setup

## 🔧 Detailed Setup

### Environment Variables Configuration

Create a `.env` file with the following variables:

```env
# ======================
# Environment Settings
# ======================
ENVIRONMENT=development
DEBUG=True

# ======================
# Database Configuration
# ======================
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/skillmatch_dev

# ======================
# Authentication
# ======================
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# ======================
# DigitalOcean Spaces
# ======================
DO_SPACES_ACCESS_KEY=your_access_key_here
DO_SPACES_SECRET_KEY=your_secret_key_here
DO_SPACES_BUCKET_NAME=skillmatch-files
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
# Optional: CDN endpoint for faster delivery
# DO_SPACES_CDN_ENDPOINT=https://skillmatch-files.nyc3.cdn.digitaloceanspaces.com

# ======================
# AI Services
# ======================
OPENAI_API_KEY=your_openai_api_key_here

# ======================
# Cache & Background Tasks
# ======================
REDIS_URL=redis://localhost:6379/0

# ======================
# Optional: Email (for notifications)
# ======================
# SMTP_SERVER=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USERNAME=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# ======================
# Optional: Monitoring
# ======================
# SENTRY_DSN=your_sentry_dsn_for_error_tracking
# LOG_LEVEL=INFO

# ======================
# Application Settings
# ======================
# FRONTEND_URL=http://localhost:3000
# MAX_FILE_SIZE=10485760  # 10MB
# ALLOWED_FILE_TYPES=pdf,docx,txt
```

### Redis Setup (Optional but Recommended)

```bash
# Install Redis
brew install redis  # macOS
# sudo apt-get install redis-server  # Ubuntu

# Start Redis
brew services start redis
# redis-server  # Direct start

# Test Redis connection
redis-cli ping  # Should return "PONG"
```

### DigitalOcean Spaces Setup

1. **Create a Space**:
   ```bash
   # Log into DigitalOcean console
   # Navigate to Spaces
   # Create new Space in your preferred region (e.g., NYC3)
   # Note your Space name and region
   ```

2. **Generate API Keys**:
   ```bash
   # Go to API section in DigitalOcean
   # Generate Spaces access keys
   # Copy Access Key and Secret Key to .env
   ```

3. **Configure CORS** (for web uploads):
   ```json
   {
     "CORSRules": [
       {
         "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
         "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3000
       }
     ]
   }
   ```

## 🐳 Docker Development (Alternative Setup)

For a completely isolated development environment:

```bash
# Start all services with Docker Compose
docker-compose up -d

# This starts:
# - PostgreSQL database with schema
# - Redis cache
# - FastAPI backend
# - Automatic migrations

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Docker Environment Variables

Create a `.env.docker` file for Docker-specific settings:

```env
# Docker-specific database URL
DATABASE_URL=postgresql+asyncpg://postgres:password@postgres:5432/skillmatch_dev
REDIS_URL=redis://redis:6379/0

# Other variables same as .env
```

## 📁 Project Structure

```
backend/
├── 📂 app/                          # Application source code
│   ├── 📂 api/                      # API layer
│   │   └── 📂 v1/                   # API version 1
│   │       ├── 📄 files.py          # File upload/download endpoints
│   │       ├── 📄 router.py         # Main API router
│   │       └── 📄 __init__.py
│   ├── 📂 core/                     # Core application modules
│   │   ├── 📄 config.py             # Configuration management
│   │   ├── 📄 database.py           # Database setup & connection
│   │   ├── 📄 exceptions.py         # Custom exception handlers
│   │   └── 📄 __init__.py
│   ├── 📂 models/                   # Data models
│   │   ├── 📄 user.py               # User-related Pydantic models
│   │   └── 📄 __init__.py
│   ├── 📂 services/                 # Business logic services
│   │   ├── 📄 storage.py            # DigitalOcean Spaces integration
│   │   └── 📄 __init__.py
│   └── 📄 __init__.py
├── 📂 tests/                        # Test suite
│   ├── 📂 unit/                     # Unit tests
│   ├── 📂 integration/              # Integration tests
│   └── 📄 conftest.py               # Pytest configuration
├── 📂 migrations/                   # Database migrations (future)
├── 📄 main.py                       # FastAPI application entry point
├── 📄 migration.sql                 # Initial database schema
├── 📄 requirements.txt              # Python dependencies
├── 📄 .env.example                  # Environment variables template
├── 📄 .env                          # Local environment (not in git)
├── 📄 docker-compose.yml            # Docker development environment
├── 📄 Dockerfile                    # Backend container definition
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .dockerignore                 # Docker ignore rules
└── 📄 README.md                     # This file
```

### Key Files Explanation

| File | Purpose | Key Features |
|------|---------|--------------|
| `main.py` | Application entry point | FastAPI app, middleware, CORS, lifespan events |
| `app/core/config.py` | Configuration management | Pydantic settings, environment validation |
| `app/core/database.py` | Database setup | Async SQLAlchemy, connection pooling |
| `app/services/storage.py` | File storage service | DigitalOcean Spaces, presigned URLs |
| `app/api/v1/files.py` | File API endpoints | Upload, download, delete, list operations |
| `migration.sql` | Database schema | Complete schema with indexes, constraints |

## 🔌 API Reference

### 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### � File Management Endpoints

#### Upload Resume

```http
POST /api/v1/files/upload/resume
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

Body:
- file: <binary_file> (PDF, DOCX, or TXT)
- description?: string (optional)
```

**Response:**
```json
{
  "file_id": "uuid-string",
  "filename": "resume.pdf",
  "file_size": 1024768,
  "upload_url": "https://spaces-url/path/to/file",
  "cdn_url": "https://cdn-url/path/to/file",
  "created_at": "2025-08-02T15:30:00Z"
}
```

#### Download File

```http
GET /api/v1/files/download/{file_id}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "download_url": "https://presigned-url-expires-in-1-hour",
  "filename": "resume.pdf",
  "expires_at": "2025-08-02T16:30:00Z"
}
```

#### List User Files

```http
GET /api/v1/files/list?limit=10&offset=0&file_type=resume
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "files": [
    {
      "file_id": "uuid-1",
      "filename": "resume_v1.pdf",
      "file_size": 1024768,
      "file_type": "resume",
      "created_at": "2025-08-02T15:30:00Z",
      "updated_at": "2025-08-02T15:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

#### Delete File

```http
DELETE /api/v1/files/{file_id}
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "File deleted successfully",
  "file_id": "uuid-string"
}
```

### 🏥 Health & Monitoring

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-02T15:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "storage": "connected",
    "cache": "connected"
  }
}
```

#### API Documentation

- **Swagger UI**: `GET /docs` - Interactive API documentation
- **ReDoc**: `GET /redoc` - Alternative documentation format
- **OpenAPI Schema**: `GET /openapi.json` - Raw OpenAPI specification

## 🗄️ Database Schema Overview

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User management | UUID primary key, email uniqueness |
| `files` | File metadata | S3 paths, GDPR compliance, versioning |
| `file_analyses` | AI analysis results | Resume parsing, skill extraction |
| `audit_logs` | Security auditing | All operations logged, partitioned |
| `user_sessions` | Session management | JWT token tracking, device info |

### Key Features

✅ **Row Level Security (RLS)**: Users can only access their own data  
✅ **Audit Logging**: All operations tracked with correlation IDs  
✅ **GDPR Compliance**: Automatic data retention and deletion  
✅ **Performance**: Optimized indexes and materialized views  
✅ **Scalability**: Partitioned tables for large datasets  

### Sample Queries

```sql
-- Get user's recent files
SELECT f.file_id, f.filename, f.created_at 
FROM files f 
WHERE f.user_id = $1 
ORDER BY f.created_at DESC 
LIMIT 10;

-- File storage analytics
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as files_uploaded,
  SUM(file_size) as total_bytes
FROM files 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;
```

## 🗄️ DigitalOcean Spaces Integration

### Bucket Organization

```
your-skillmatch-bucket/
├── 📁 resumes/                    # User resume files
│   ├── 📁 {user-uuid-1}/          # User-specific directory
│   │   ├── 📄 20250802_143022_resume_v1.pdf
│   │   ├── 📄 20250802_150115_resume_v2.docx
│   │   └── 📄 metadata.json       # File metadata cache
│   └── 📁 {user-uuid-2}/
├── 📁 temp-uploads/               # Temporary upload staging
│   └── 📁 processing/             # Files being processed
├── 📁 thumbnails/                 # Generated file previews
│   └── 📁 {user-uuid}/
└── 📁 exports/                    # Generated reports/exports
    └── 📁 {user-uuid}/
```

### Security Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| **Private ACL** | All files stored with private access | No direct public access |
| **Presigned URLs** | 1-hour expiration for downloads | Temporary, secure access |
| **User Isolation** | Folder structure by user UUID | Data segregation |
| **CORS Configuration** | Domain-specific CORS rules | Secure cross-origin uploads |
| **Content Validation** | MIME type and file signature checks | Prevent malicious uploads |

## 🔍 Monitoring & Observability

### 📈 Health Checks

```bash
# Available health check endpoints
GET /health              # Overall application health
GET /health/live         # Liveness probe (K8s compatible)
GET /health/ready        # Readiness probe (K8s compatible)

# Example response
{
  "status": "healthy",
  "timestamp": "2025-08-02T15:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "storage": "connected", 
    "cache": "connected"
  }
}
```

### 📊 Performance Metrics

The application includes built-in metrics for monitoring:

- **Request Metrics**: Response times, status codes, endpoint usage
- **Database Metrics**: Connection pool status, query performance
- **File Operations**: Upload/download success rates, file sizes
- **Error Tracking**: Exception rates, error patterns

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html --cov-report=term-missing

# Run specific test categories
pytest tests/unit/          # Unit tests only
pytest tests/integration/   # Integration tests only
pytest -k "upload"         # Tests matching keyword

# Run tests in parallel
pip install pytest-xdist
pytest -n auto
```

### Test Coverage

The project maintains high test coverage:
- **Unit Tests**: Core business logic, models, utilities
- **Integration Tests**: Database operations, external APIs
- **API Tests**: Endpoint functionality, error handling
- **Security Tests**: Authentication, authorization, input validation

## 🚀 Production Deployment

### Environment Configuration

```env
# Production settings
ENVIRONMENT=production
DEBUG=False

# Secure database connection
DATABASE_URL=postgresql+asyncpg://user:password@prod-db:5432/skillmatch?ssl=require

# Production DigitalOcean Spaces
DO_SPACES_BUCKET_NAME=skillmatch-prod-files
DO_SPACES_CDN_ENDPOINT=https://skillmatch-prod-files.nyc3.cdn.digitaloceanspaces.com

# Strong security keys
JWT_SECRET_KEY=your-production-secret-key-minimum-32-characters

# Error monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Production Redis
REDIS_URL=redis://prod-redis-cluster:6379/0
```

### Docker Production Deployment

```bash
# Build production image
docker build -t skillmatch-backend:latest .

# Run with production settings
docker run -d \
  --name skillmatch-backend \
  --env-file .env.production \
  -p 8000:8000 \
  skillmatch-backend:latest
```

## 🔐 Security Best Practices

### Authentication Security
- JWT tokens with short expiration (30 minutes)
- Secure password hashing with bcrypt
- Rate limiting on authentication endpoints
- Session management with Redis

### Data Protection
- Input validation on all endpoints
- SQL injection prevention with SQLAlchemy ORM
- File type validation and content scanning
- HTTPS enforcement in production

### API Security
- CORS configuration for trusted domains
- Request size limits and timeout settings
- API versioning for backward compatibility
- Comprehensive logging and audit trails

## 📚 API Documentation

When the server is running, explore the API documentation:

- **📖 Swagger UI**: http://localhost:8000/docs
  - Interactive API testing
  - Request/response examples
  - Authentication flow testing

- **📋 ReDoc**: http://localhost:8000/redoc  
  - Clean, readable documentation
  - Detailed schema information
  - Export functionality

- **🔍 OpenAPI Schema**: http://localhost:8000/openapi.json
  - Raw OpenAPI 3.0 specification
  - Client SDK generation
  - API contract validation

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **🍴 Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/resume-optimizer-studio.git
   cd resume-optimizer-studio/backend
   ```

2. **🌿 Create Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

3. **🧪 Test Your Changes**
   ```bash
   pytest --cov=app
   black app/ tests/
   flake8 app/
   ```

4. **📝 Document Changes**
   - Update README if needed
   - Add docstrings to new functions
   - Include examples in API docs

5. **🚀 Submit Pull Request**
   - Clear description of changes
   - Reference related issues
   - Include test results

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Verify credentials
psql -h localhost -U postgres -d skillmatch_dev -c "SELECT version();"
```

**Virtual Environment Issues**
```bash
# Recreate virtual environment
rm -rf venv
python3.13 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**DigitalOcean Spaces Access**
```bash
# Test credentials with s3cmd
pip install s3cmd
s3cmd --configure
s3cmd ls s3://your-bucket/
```

**Import Errors**
```bash
# Ensure you're in the backend directory
cd /path/to/resume-optimizer-studio/backend

# Check Python path
python -c "import sys; print(sys.path)"
```

### Getting Help

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/harshajustin/resume-optimizer-studio/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/harshajustin/resume-optimizer-studio/discussions)  
- 📧 **Security Issues**: Email maintainers directly
- 📖 **Documentation**: Check our [Wiki](https://github.com/harshajustin/resume-optimizer-studio/wiki)

## 📄 License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.

---

## 🎯 What's Next?

### 🚀 Ready to Start?

1. **✅ Verify Setup**: Run `curl http://localhost:8000/health`
2. **🔐 Configure Credentials**: Update your `.env` file
3. **📊 Run Database Migration**: Execute `migration.sql`  
4. **📖 Explore API**: Visit http://localhost:8000/docs
5. **🧪 Run Tests**: Execute `pytest --cov=app`

### 🎨 Enhancement Ideas

- **🤖 AI Features**: Resume parsing, skill extraction, job matching
- **📧 Notifications**: Email alerts for job opportunities
- **📱 Mobile API**: Mobile-optimized endpoints
- **🔍 Search**: Full-text search across resumes
- **📊 Analytics**: User insights and usage patterns

### 🎓 Learning Resources

- [FastAPI Advanced User Guide](https://fastapi.tiangolo.com/advanced/)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [DigitalOcean Spaces Guide](https://docs.digitalocean.com/products/spaces/)
- [Python Async Programming](https://docs.python.org/3/library/asyncio.html)

---

**🎉 Happy Coding!**

*Built with ❤️ using FastAPI, PostgreSQL, and DigitalOcean Spaces*

**Questions?** Open an issue on [GitHub](https://github.com/harshajustin/resume-optimizer-studio) or start a [discussion](https://github.com/harshajustin/resume-optimizer-studio/discussions).

**Found this helpful?** Give us a ⭐ on GitHub!

## 🏗️ Database Schema Features

Your PostgreSQL schema includes:

✅ **File Storage Integration**
- File path validation for DigitalOcean Spaces URLs
- GDPR-compliant file deletion
- Automatic file metadata tracking

✅ **Security Features**
- Row Level Security (RLS)
- JWT-based authentication
- Audit logging with partitioning

✅ **Performance Optimizations**
- Optimized indexes for file queries
- Materialized views for analytics
- Automatic partition management

✅ **GDPR Compliance**
- Automatic data retention policies
- Secure data pseudonymization
- Audit trail for all operations

## 🗄️ DigitalOcean Spaces Configuration

### Bucket Structure

```
your-bucket/
├── resumes/
│   ├── user-uuid-1/
│   │   ├── 20250802_143022_a1b2c3d4.pdf
│   │   └── 20250802_150115_e5f6g7h8.docx
│   └── user-uuid-2/
└── temp-uploads/
```

### Security

- All files are stored with `private` ACL
- Access via presigned URLs (1-hour expiration)
- User ownership verification before access
- Automatic file cleanup for GDPR compliance

## 🚀 Deployment

### Production Environment

1. **Set up DigitalOcean Spaces**:
   ```bash
   # Create space via DigitalOcean console
   # Enable CDN for better performance
   # Configure CORS for your domain
   ```

2. **Environment Variables**:
   ```env
   DEBUG=False
   ENVIRONMENT=production
   DATABASE_URL=postgresql+asyncpg://user:pass@prod-db:5432/skillmatch
   DO_SPACES_CDN_ENDPOINT=https://your-bucket.nyc3.cdn.digitaloceanspaces.com
   SECURE_COOKIES=True
   ```

3. **Deploy with Docker**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Performance Tuning

- Configure connection pooling with PgBouncer
- Enable Redis clustering for scale
- Use CDN for file delivery
- Monitor with application metrics

## 🔍 Monitoring & Logging

- Structured logging with correlation IDs
- Health check endpoints
- Database performance monitoring
- File upload/download metrics
- Error tracking and alerting

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app

# Integration tests
pytest tests/integration/
```

## 📚 API Documentation

When running in development mode, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔐 Security

- JWT tokens with configurable expiration
- Rate limiting on all endpoints
- File type validation and content scanning
- SQL injection prevention with SQLAlchemy
- CORS configuration for production
- Secure headers middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Next Steps:**
1. Configure your DigitalOcean Spaces credentials
2. Set up JWT secret keys
3. Run the migration script
4. Start developing your AI-powered features!

For questions or support, please open an issue in the repository.
