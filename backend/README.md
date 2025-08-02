# SkillMatch AI Backend

FastAPI-based backend for the SkillMatch AI resume optimization platform with DigitalOcean Spaces integration.

## 🚀 Features

- **FastAPI Framework**: High-performance async API
- **DigitalOcean Spaces**: S3-compatible file storage for resumes
- **PostgreSQL**: Production-ready database with advanced features
- **JWT Authentication**: Secure token-based auth
- **File Processing**: Resume parsing and AI analysis
- **Background Tasks**: Async job processing with Celery
- **Docker Support**: Easy deployment and development

## 🛠️ Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL 14+ with asyncpg
- **Storage**: DigitalOcean Spaces (S3-compatible)
- **Cache**: Redis
- **Auth**: JWT with python-jose
- **File Processing**: PyPDF2, python-docx, pdfplumber
- **AI/ML**: OpenAI, LangChain, sentence-transformers
- **Task Queue**: Celery
- **Logging**: Structlog

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 14+
- Redis
- DigitalOcean Spaces account
- Docker & Docker Compose (optional)

## 🔧 Setup

### 1. Clone and Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/skillmatch_ai

# DigitalOcean Spaces
DO_SPACES_ACCESS_KEY=your_access_key
DO_SPACES_SECRET_KEY=your_secret_key
DO_SPACES_BUCKET_NAME=your-bucket-name
DO_SPACES_REGION=nyc3
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key

# Other services...
```

### 3. Database Setup

Run the migration to create your database schema:

```bash
psql -d your_database -f migration.sql
```

### 4. Run the Application

#### Option A: Direct Python

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Option B: Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database with your schema
- Redis cache
- FastAPI backend
- Automatic database initialization

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── files.py          # File upload endpoints
│   │       └── router.py         # API router
│   ├── core/
│   │   ├── config.py             # App configuration
│   │   ├── database.py           # Database setup
│   │   └── exceptions.py         # Custom exceptions
│   ├── models/
│   │   └── user.py               # Pydantic models
│   └── services/
│       └── storage.py            # DigitalOcean Spaces service
├── migration.sql                 # Database schema
├── requirements.txt              # Python dependencies
├── docker-compose.yml           # Docker services
├── Dockerfile                   # Backend container
├── .env.example                 # Environment template
└── main.py                      # FastAPI app entry point
```

## 🔌 API Endpoints

### File Upload

```http
POST /api/v1/files/upload/resume
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

{
  "file": <resume_file>
}
```

### File Download

```http
GET /api/v1/files/download/{file_key}
Authorization: Bearer <jwt_token>
```

### List User Files

```http
GET /api/v1/files/list
Authorization: Bearer <jwt_token>
```

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
