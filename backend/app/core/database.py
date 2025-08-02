"""
Database Configuration and Connection Management
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
import structlog

from app.core.config import settings

logger = structlog.get_logger()

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=True,
    echo=settings.DEBUG,
    poolclass=NullPool if "sqlite" in settings.DATABASE_URL else None
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False
)

# Base class for SQLAlchemy models
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    Dependency function to get database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error("Database session error", error=str(e))
            raise
        finally:
            await session.close()


async def init_db():
    """
    Initialize database connection and run health check
    """
    try:
        async with engine.begin() as conn:
            # Test connection
            await conn.execute(text("SELECT 1"))
            logger.info("✅ Database connection established successfully")
            
    except Exception as e:
        logger.error("❌ Database connection failed", error=str(e))
        raise


async def close_db():
    """
    Close database connections
    """
    await engine.dispose()
    logger.info("Database connections closed")


# PostgreSQL-specific utilities
class DatabaseUtils:
    """Database utility functions"""
    
    @staticmethod
    async def execute_raw_sql(query: str, params: dict = None):
        """Execute raw SQL query"""
        async with AsyncSessionLocal() as session:
            result = await session.execute(text(query), params or {})
            await session.commit()
            return result
    
    @staticmethod
    async def check_table_exists(table_name: str) -> bool:
        """Check if a table exists"""
        query = """
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = :table_name
        );
        """
        result = await DatabaseUtils.execute_raw_sql(query, {"table_name": table_name})
        return result.scalar()
    
    @staticmethod
    async def get_table_row_count(table_name: str) -> int:
        """Get row count for a table"""
        query = f"SELECT COUNT(*) FROM {table_name}"
        result = await DatabaseUtils.execute_raw_sql(query)
        return result.scalar()


# Import text here to avoid circular imports
from sqlalchemy import text
