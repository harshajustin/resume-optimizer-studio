"""
Authentication API Routes
Handles user registration, login, logout, and token management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import asyncpg
import uuid

from app.core.database import get_db
from app.core.auth import (
    create_access_token, 
    create_refresh_token, 
    verify_refresh_token,
    get_current_active_user,
    security
)
from app.core.security import hash_password, verify_password, validate_password_strength
from app.models.auth import (
    UserCreate, 
    UserLogin, 
    TokenResponse, 
    TokenRefresh, 
    UserResponse,
    PasswordReset,
    PasswordResetConfirm,
    ChangePassword
)
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account
    """
    # Validate password strength
    is_valid, error_msg = validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    try:
        # Check if user already exists
        from sqlalchemy import text
        
        result = await db.execute(
            text("SELECT id FROM users WHERE email = :email"),
            {"email": user_data.email}
        )
        existing_user = result.fetchone()
            
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        user_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        # Create user
        await db.execute(
            text("""
                INSERT INTO users (id, email, full_name, hashed_password, is_active, created_at, updated_at)
                VALUES (:id, :email, :full_name, :hashed_password, :is_active, :created_at, :updated_at)
            """),
            {
                "id": user_id, 
                "email": user_data.email, 
                "full_name": user_data.name, 
                "hashed_password": hashed_password, 
                "is_active": True, 
                "created_at": now, 
                "updated_at": now
            }
        )
        await db.commit()
        
        # Create tokens
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = create_refresh_token(data={"sub": user_id})
        
        # Create user response
        user_response = UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            is_active=True,
            created_at=now,
            updated_at=now
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )


@router.post("/login", response_model=TokenResponse)
async def login_user(
    user_credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """
    Login user and return JWT tokens
    """
    try:
        # Get user from database using SQLAlchemy
        from sqlalchemy import text
        
        result = await db.execute(
            text("SELECT id, email, full_name, hashed_password, is_active, created_at, updated_at FROM users WHERE email = :email"),
            {"email": user_credentials.email}
        )
        user_row = result.fetchone()
        
        # Verify user exists and password is correct
        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Verify password with bcrypt warning suppression
        try:
            import warnings
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", message=".*bcrypt.*")
                password_valid = verify_password(user_credentials.password, user_row.hashed_password)
        except Exception:
            password_valid = False
            
        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if user is active
        if not user_row.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is disabled"
            )
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user_row.id)})
        refresh_token = create_refresh_token(data={"sub": str(user_row.id)})
        
        # Create user response
        user_response = UserResponse(
            id=str(user_row.id),
            email=user_row.email,
            name=user_row.full_name,
            is_active=user_row.is_active,
            created_at=user_row.created_at,
            updated_at=user_row.updated_at
        )
        
        await db.commit()
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as they are
        raise
    except Exception as e:
        await db.rollback()
        print(f"Login error: {e}")  # Debug print
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication error occurred"
        )


@router.post("/refresh", response_model=dict)
async def refresh_token(
    token_data: TokenRefresh,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token
    """
    try:
        # Verify refresh token
        user_id = verify_refresh_token(token_data.refresh_token)
        
        # Get user from database
        async with db.begin():
            result = await db.execute(
                "SELECT id, is_active FROM users WHERE id = $1",
                user_id
            )
            user_row = result.fetchone()
        
        if not user_row or not user_row['is_active']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )


@router.post("/logout")
async def logout_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    current_user: UserResponse = Depends(get_current_active_user)
):
    """
    Logout user (in a real app, you'd invalidate the token)
    """
    # In a production app, you would:
    # 1. Add the token to a blacklist
    # 2. Store blacklisted tokens in Redis with expiration
    # 3. Check blacklist in the auth dependency
    
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: UserResponse = Depends(get_current_active_user)
):
    """
    Get current user information
    """
    return current_user


@router.put("/change-password")
async def change_password(
    password_data: ChangePassword,
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password
    """
    try:
        # Get current password hash
        async with db.begin():
            result = await db.execute(
                "SELECT password_hash FROM users WHERE id = $1",
                current_user.id
            )
            user_row = result.fetchone()
        
        if not user_row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify current password
        if not verify_password(password_data.current_password, user_row['password_hash']):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Validate new password strength
        is_valid, error_msg = validate_password_strength(password_data.new_password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        # Hash new password and update
        new_password_hash = hash_password(password_data.new_password)
        
        async with db.begin():
            await db.execute(
                "UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3",
                new_password_hash, datetime.utcnow(), current_user.id
            )
        
        return {"message": "Password changed successfully"}
        
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )


@router.delete("/account")
async def delete_account(
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user account (soft delete by deactivating)
    """
    try:
        async with db.begin():
            await db.execute(
                "UPDATE users SET is_active = false, updated_at = $1 WHERE id = $2",
                datetime.utcnow(), current_user.id
            )
        
        return {"message": "Account deactivated successfully"}
        
    except asyncpg.exceptions.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred"
        )
