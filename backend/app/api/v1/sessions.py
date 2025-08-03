"""
Session Management API Routes
Handles user session management, device tracking, and security
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime
import asyncio

from app.core.database import get_db
from app.core.auth import get_current_active_user
from app.models.auth import UserResponse
from app.models.session import (
    ActiveSessionsResponse, 
    SessionRevoke, 
    BulkSessionRevoke,
    SessionStats,
    SessionSecurity,
    SessionResponse
)
from app.services.session import SessionService


router = APIRouter(prefix="/sessions", tags=["Session Management"])


@router.get("/active", response_model=ActiveSessionsResponse)
async def get_active_sessions(
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all active sessions for the current user
    """
    try:
        sessions = await SessionService.get_user_active_sessions(
            db=db, 
            user_id=current_user.id
        )
        return sessions
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve sessions"
        )


@router.post("/revoke", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_session(
    session_revoke: SessionRevoke,
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke a specific session
    """
    try:
        success = await SessionService.revoke_session(
            db=db,
            session_id=session_revoke.session_id,
            user_id=current_user.id
        )
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found or already revoked"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke session"
        )


@router.post("/revoke-all", status_code=status.HTTP_200_OK)
async def revoke_all_sessions(
    request: Request,
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke all sessions except the current one
    """
    try:
        # Get current session ID from JWT if available
        current_session_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            # Extract JTI from current token to identify current session
            from jose import jwt
            from app.core.config import settings
            
            try:
                token = auth_header.replace("Bearer ", "")
                payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
                jwt_jti = payload.get("jti")
                
                if jwt_jti:
                    current_session = await SessionService.get_session_by_jwt_jti(db, jwt_jti)
                    if current_session:
                        current_session_id = current_session["id"]
            except:
                pass  # If we can't get current session, revoke all
        
        revoked_count = await SessionService.revoke_all_user_sessions(
            db=db,
            user_id=current_user.id,
            exclude_session_id=current_session_id
        )
        
        return {"message": f"Successfully revoked {revoked_count} sessions"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke sessions"
        )


@router.post("/revoke-bulk", status_code=status.HTTP_200_OK)
async def revoke_bulk_sessions(
    bulk_revoke: BulkSessionRevoke,
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Revoke multiple sessions by ID
    """
    try:
        revoked_count = 0
        
        for session_id in bulk_revoke.session_ids:
            success = await SessionService.revoke_session(
                db=db,
                session_id=session_id,
                user_id=current_user.id
            )
            if success:
                revoked_count += 1
        
        return {
            "message": f"Successfully revoked {revoked_count} out of {len(bulk_revoke.session_ids)} sessions"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke sessions"
        )


@router.get("/stats", response_model=SessionStats)
async def get_session_stats(
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get session statistics for the current user
    """
    try:
        stats = await SessionService.get_session_stats(
            db=db,
            user_id=current_user.id
        )
        return stats
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve session statistics"
        )


@router.get("/security", response_model=SessionSecurity)
async def get_session_security(
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get security information for user sessions
    """
    try:
        from sqlalchemy import text
        
        # Get suspicious activities (multiple failed logins, unusual locations, etc.)
        result = await db.execute(
            text("""
                SELECT 
                    failed_login_attempts,
                    locked_until,
                    last_login_at
                FROM users 
                WHERE id = :user_id
            """),
            {"user_id": current_user.id}
        )
        
        user_security = result.fetchone()
        
        # Check for recent failed login attempts from audit logs
        suspicious_activities = []
        
        # Get recent login attempts from different IPs
        session_result = await db.execute(
            text("""
                SELECT 
                    ip_address,
                    device_info,
                    created_at,
                    COUNT(*) as login_count
                FROM user_sessions 
                WHERE user_id = :user_id 
                AND created_at >= NOW() - INTERVAL '24 hours'
                GROUP BY ip_address, device_info, DATE_TRUNC('hour', created_at)
                HAVING COUNT(*) > 3
                ORDER BY created_at DESC
            """),
            {"user_id": current_user.id}
        )
        
        for row in session_result.fetchall():
            suspicious_activities.append({
                "type": "multiple_logins",
                "description": f"Multiple logins from IP {row.ip_address}",
                "timestamp": row.created_at.isoformat(),
                "metadata": {
                    "ip_address": str(row.ip_address),
                    "login_count": row.login_count,
                    "device_info": row.device_info
                }
            })
        
        return SessionSecurity(
            suspicious_activities=suspicious_activities,
            login_attempts=user_security.failed_login_attempts or 0,
            last_failed_login=None,  # Would need audit log implementation
            account_locked=user_security.locked_until is not None and user_security.locked_until > datetime.utcnow(),
            lock_expires_at=user_security.locked_until
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve security information"
        )


@router.post("/cleanup", status_code=status.HTTP_200_OK)
async def cleanup_expired_sessions(
    current_user: UserResponse = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Clean up expired sessions (admin/maintenance endpoint)
    """
    try:
        # This could be restricted to admin users only
        cleaned_count = await SessionService.cleanup_expired_sessions(db)
        
        return {
            "message": f"Cleaned up {cleaned_count} expired sessions"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cleanup sessions"
        )
