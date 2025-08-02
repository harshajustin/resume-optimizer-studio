"""
Authentication Dependencies
FastAPI dependencies for authentication and authorization
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from datetime import datetime, timedelta
import asyncpg

from app.core.config import settings
from app.core.database import get_db
from app.models.auth import UserResponse


# Security scheme for JWT tokens
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Get current authenticated user from JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            credentials.credentials, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        # Check token expiration
        exp = payload.get("exp")
        if exp is None or datetime.utcnow() > datetime.fromtimestamp(exp):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except JWTError:
        raise credentials_exception

    # Get user from database
    try:
        query = """
        SELECT id, email, name, is_active, created_at, updated_at 
        FROM users WHERE id = $1
        """
        
        user_row = await db.fetchrow(query, user_id)
            
        if user_row is None:
            raise credentials_exception
            
        if not user_row['is_active']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled"
            )
            
        return UserResponse(
            id=user_row['id'],
            email=user_row['email'],
            name=user_row['name'],
            is_active=user_row['is_active'],
            created_at=user_row['created_at'],
            updated_at=user_row['updated_at']
        )
        
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )


async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user)
) -> UserResponse:
    """
    Get current active user (additional check for active status)
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled"
        )
    return current_user


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create JWT access token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta = None):
    """
    Create JWT refresh token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def verify_refresh_token(token: str) -> str:
    """
    Verify refresh token and return user ID
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise JWTError("Invalid token")
            
        # Check token expiration
        exp = payload.get("exp")
        if exp is None or datetime.utcnow() > datetime.fromtimestamp(exp):
            raise JWTError("Token expired")
            
        return user_id
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
