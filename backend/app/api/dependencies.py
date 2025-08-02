"""
API Dependencies
Common dependencies used across API endpoints
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from typing import Optional
import structlog

from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import AuthenticationError
from app.models.user import User

logger = structlog.get_logger()
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    try:
        # Decode JWT token
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise AuthenticationError("Invalid token: missing user ID")
        
        # TODO: Get user from database
        # user = await UserService.get_by_id(db, user_id)
        # if user is None or not user.is_active:
        #     raise AuthenticationError("User not found or inactive")
        
        # For now, create a mock user object
        user = User(
            id=user_id,
            email=payload.get("email", ""),
            is_active=True
        )
        
        return user
        
    except JWTError as e:
        logger.error("JWT decode error", error=str(e))
        raise AuthenticationError("Invalid token")
    except Exception as e:
        logger.error("Authentication error", error=str(e))
        raise AuthenticationError("Authentication failed")


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user (additional check for active status)
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None
    """
    if not credentials:
        return None
    
    try:
        # This would use get_current_user logic but return None on failure
        # For now, return None
        return None
    except:
        return None
