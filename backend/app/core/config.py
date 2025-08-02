"""
Application Configuration
Handles environment variables and application settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # App Info
    APP_NAME: str = "SkillMatch AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 30
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # DigitalOcean Spaces
    DO_SPACES_ACCESS_KEY: str
    DO_SPACES_SECRET_KEY: str
    DO_SPACES_BUCKET_NAME: str
    DO_SPACES_REGION: str = "nyc3"
    DO_SPACES_ENDPOINT: str
    DO_SPACES_CDN_ENDPOINT: str = ""
    
    # File Upload
    MAX_FILE_SIZE_MB: int = 25
    ALLOWED_FILE_TYPES: str = "pdf,docx,doc,txt"
    UPLOAD_FOLDER: str = "resumes"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI/ML
    OPENAI_API_KEY: str = ""
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    
    # Email
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8080"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Security
    BCRYPT_ROUNDS: int = 12
    SECURE_COOKIES: bool = False
    
    # Monitoring
    SENTRY_DSN: str = ""
    
    @property
    def allowed_file_types_list(self) -> List[str]:
        """Get allowed file types as a list"""
        return [ext.strip() for ext in self.ALLOWED_FILE_TYPES.split(",")]
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Get allowed origins as a list"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    @property
    def max_file_size_bytes(self) -> int:
        """Get max file size in bytes"""
        return self.MAX_FILE_SIZE_MB * 1024 * 1024
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
