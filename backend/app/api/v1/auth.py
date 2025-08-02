"""
Authentication API Routes
Handles user registration, login, logout, and token management with session tracking
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import asyncpg
import uuid
import user_agents
from ipaddress import AddressValueError, ip_address

from app.core.database import get_db
from app.core.auth import (
    create_access_token, 
    create_refresh_token, 
    verify_refresh_token,
    get_current_active_user,
    generate_session_token,
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
from app.models.session import SessionCreate, DeviceInfo
from app.services.session import SessionService
from app.core.config import settings


router = APIRouter(prefix="/auth", tags=["Authentication"])


def extract_device_info(request: Request) -> DeviceInfo:
    """Extract device information from request headers"""
    user_agent_string = request.headers.get("User-Agent", "")
    user_agent = user_agents.parse(user_agent_string)
    
    return DeviceInfo(
        device_type="mobile" if user_agent.is_mobile else "tablet" if user_agent.is_tablet else "desktop",
        os=f"{user_agent.os.family} {user_agent.os.version_string}",
        browser=f"{user_agent.browser.family}",
        browser_version=user_agent.browser.version_string,
        user_agent=user_agent_string,
        timezone=request.headers.get("X-Timezone", "UTC")
    )


def extract_ip_address(request: Request) -> str:
    """Extract client IP address from request"""
    # Check for forwarded IP first (common in reverse proxy setups)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP in the chain
        ip = forwarded_for.split(",")[0].strip()
        try:
            ip_address(ip)  # Validate IP format
            return ip
        except AddressValueError:
            pass
    
    # Check other common headers
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        try:
            ip_address(real_ip)
            return real_ip
        except AddressValueError:
            pass
    
    # Fall back to client IP
    client_ip = request.client.host if request.client else "127.0.0.1"
    return client_ip


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account with session tracking
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
        
        # Create tokens with JTI
        access_token, access_jti = create_access_token(data={"sub": user_id})
        refresh_token, refresh_jti = create_refresh_token(data={"sub": user_id})
        
        # Extract session information
        device_info = extract_device_info(request)
        ip_addr = extract_ip_address(request)
        
        # Create session
        session_data = SessionCreate(
            device_info=device_info,
            ip_address=ip_addr
        )
        
        access_expires_at = now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
        session_token = generate_session_token()
        session_id = await SessionService.create_session(
            db=db,
            user_id=user_id,
            jwt_jti=access_jti,
            token=session_token,
            session_data=session_data,
            expires_at=access_expires_at
        )
        
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
        
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=TokenResponse)
async def login_user(
    user_credentials: UserLogin,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Login user and return JWT tokens with session tracking
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
        
        # Create tokens with JTI
        access_token, access_jti = create_access_token(data={"sub": str(user_row.id)})
        refresh_token, refresh_jti = create_refresh_token(data={"sub": str(user_row.id)})
        
        # Extract session information
        device_info = extract_device_info(request)
        ip_addr = extract_ip_address(request)
        
        # Create session
        session_data = SessionCreate(
            device_info=device_info,
            ip_address=ip_addr
        )
        
        now = datetime.utcnow()
        access_expires_at = now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
        session_token = generate_session_token()
        session_id = await SessionService.create_session(
            db=db,
            user_id=str(user_row.id),
            jwt_jti=access_jti,
            token=session_token,
            session_data=session_data,
            expires_at=access_expires_at
        )
        
        # Create user response
        user_response = UserResponse(
            id=str(user_row.id),
            email=user_row.email,
            name=user_row.full_name,
            is_active=user_row.is_active,
            created_at=user_row.created_at,
            updated_at=user_row.updated_at
        )
        
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


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    token_data: TokenRefresh,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token with session validation
    """
    try:
        # Verify refresh token and get session info
        user_id, old_jwt_jti = await verify_refresh_token(token_data.refresh_token, db)
        
        # Get user from database
        from sqlalchemy import text
        result = await db.execute(
            text("SELECT id, email, full_name, is_active, created_at, updated_at FROM users WHERE id = :user_id"),
            {"user_id": user_id}
        )
        user_row = result.fetchone()
        
        if not user_row or not user_row.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new tokens with JTI
        access_token, access_jti = create_access_token(data={"sub": user_id})
        refresh_token, refresh_jti = create_refresh_token(data={"sub": user_id})
        
        # Extract session information
        device_info = extract_device_info(request)
        ip_addr = extract_ip_address(request)
        
        # Update session with new JTI and extend expiry
        session_data = SessionCreate(
            device_info=device_info,
            ip_address=ip_addr
        )
        
        now = datetime.utcnow()
        access_expires_at = now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Create new session for refreshed token
        session_token = generate_session_token()
        await SessionService.create_session(
            db=db,
            user_id=user_id,
            jwt_jti=access_jti,
            token=session_token,
            session_data=session_data,
            expires_at=access_expires_at
        )
        
        # Revoke old session
        await SessionService.revoke_sessions_by_jwt_jti(db, [old_jwt_jti])
        
        # Create user response
        user_response = UserResponse(
            id=str(user_row.id),
            email=user_row.email,
            name=user_row.full_name,
            is_active=user_row.is_active,
            created_at=user_row.created_at,
            updated_at=user_row.updated_at
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_user(
    request: Request,
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Logout user and revoke current session
    """
    try:
        # Get current session JTI from token
        auth_header = request.headers.get("Authorization")
        if auth_header:
            from jose import jwt
            
            try:
                token = auth_header.replace("Bearer ", "")
                payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
                jwt_jti = payload.get("jti")
                
                if jwt_jti:
                    # Revoke current session
                    await SessionService.revoke_sessions_by_jwt_jti(db, [jwt_jti])
            except:
                pass  # If we can't decode token, just return success
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )


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
