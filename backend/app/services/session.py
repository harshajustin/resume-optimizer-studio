"""
Session Service
Database operations for user session management
"""

import hashlib
import secrets
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, and_, or_
from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.models.session import (
    SessionCreate, SessionResponse, ActiveSessionsResponse, 
    SessionStats, DeviceInfo
)


class SessionService:
    """Service for managing user sessions"""
    
    @staticmethod
    def generate_token_hash(token: str) -> str:
        """Generate hash for storing token securely"""
        return hashlib.sha256(token.encode()).hexdigest()
    
    @staticmethod
    def generate_session_token() -> str:
        """Generate a secure session token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    async def create_session(
        db: AsyncSession,
        user_id: str,
        jwt_jti: str,
        token: str,
        session_data: SessionCreate,
        expires_at: datetime
    ) -> str:
        """Create a new user session"""
        session_id = str(uuid.uuid4())
        token_hash = SessionService.generate_token_hash(token)
        
        # Convert device info to JSONB if provided
        device_info_json = None
        if session_data.device_info:
            import json
            device_info_json = json.dumps(session_data.device_info.model_dump())
        
        try:
            await db.execute(
                text("""
                    INSERT INTO user_sessions 
                    (id, user_id, token_hash, jwt_jti, device_info, ip_address, expires_at)
                    VALUES (:id, :user_id, :token_hash, :jwt_jti, :device_info, :ip_address, :expires_at)
                """),
                {
                    "id": session_id,
                    "user_id": user_id,
                    "token_hash": token_hash,
                    "jwt_jti": jwt_jti,
                    "device_info": device_info_json,
                    "ip_address": str(session_data.ip_address) if session_data.ip_address else None,
                    "expires_at": expires_at
                }
            )
            await db.commit()
            return session_id
            
        except IntegrityError:
            await db.rollback()
            raise ValueError("Failed to create session - token already exists")
    
    @staticmethod
    async def get_session_by_token(db: AsyncSession, token: str) -> Optional[Dict]:
        """Get session by token hash"""
        token_hash = SessionService.generate_token_hash(token)
        
        result = await db.execute(
            text("""
                SELECT id, user_id, jwt_jti, device_info, ip_address, 
                       expires_at, is_revoked, created_at
                FROM user_sessions 
                WHERE token_hash = :token_hash 
                AND expires_at > NOW() 
                AND is_revoked = FALSE
            """),
            {"token_hash": token_hash}
        )
        
        row = result.fetchone()
        if row:
            return {
                "id": str(row.id),
                "user_id": str(row.user_id),
                "jwt_jti": row.jwt_jti,
                "device_info": row.device_info,
                "ip_address": str(row.ip_address) if row.ip_address else None,
                "expires_at": row.expires_at,
                "is_revoked": row.is_revoked,
                "created_at": row.created_at
            }
        return None
    
    @staticmethod
    async def get_session_by_jwt_jti(db: AsyncSession, jwt_jti: str) -> Optional[Dict]:
        """Get session by JWT JTI"""
        result = await db.execute(
            text("""
                SELECT id, user_id, token_hash, device_info, ip_address,
                       expires_at, is_revoked, created_at
                FROM user_sessions 
                WHERE jwt_jti = :jwt_jti
            """),
            {"jwt_jti": jwt_jti}
        )
        
        row = result.fetchone()
        if row:
            return {
                "id": str(row.id),
                "user_id": str(row.user_id),
                "token_hash": row.token_hash,
                "device_info": row.device_info,
                "ip_address": str(row.ip_address) if row.ip_address else None,
                "expires_at": row.expires_at,
                "is_revoked": row.is_revoked,
                "created_at": row.created_at
            }
        return None
    
    @staticmethod
    async def get_user_active_sessions(
        db: AsyncSession, 
        user_id: str, 
        current_session_id: Optional[str] = None
    ) -> ActiveSessionsResponse:
        """Get all active sessions for a user"""
        try:
            result = await db.execute(
                text("""
                    SELECT id, device_info, ip_address, expires_at, 
                           is_revoked, created_at
                    FROM user_sessions 
                    WHERE user_id = :user_id 
                    AND expires_at > NOW() 
                    AND is_revoked = FALSE
                    ORDER BY created_at DESC
                """),
                {"user_id": user_id}
            )
            
            rows = result.fetchall()
            
            sessions = []
            for row in rows:
                # Parse device_info JSON if present
                device_info = None
                if row.device_info:
                    import json
                    try:
                        device_info = json.loads(row.device_info) if isinstance(row.device_info, str) else row.device_info
                    except (json.JSONDecodeError, TypeError):
                        device_info = row.device_info
                
                sessions.append(SessionResponse(
                    id=str(row.id),
                    user_id=user_id,
                    device_info=device_info,
                    ip_address=str(row.ip_address) if row.ip_address else None,
                    expires_at=row.expires_at,
                    is_revoked=row.is_revoked,
                    created_at=row.created_at
                ))

            return ActiveSessionsResponse(
                sessions=sessions,
                total_count=len(sessions),
                current_session_id=current_session_id
            )
        except Exception as e:
            print(f"ERROR in get_user_active_sessions: {e}")
            raise

    @staticmethod
    async def revoke_session(
        db: AsyncSession, 
        session_id: str, 
        user_id: Optional[str] = None
    ) -> bool:
        """Revoke a specific session"""
        conditions = ["id = :session_id"]
        params = {"session_id": session_id}
        
        if user_id:
            conditions.append("user_id = :user_id")
            params["user_id"] = user_id
        
        result = await db.execute(
            text(f"""
                UPDATE user_sessions 
                SET is_revoked = TRUE, updated_at = NOW()
                WHERE {' AND '.join(conditions)}
                AND is_revoked = FALSE
            """),
            params
        )
        
        await db.commit()
        return result.rowcount > 0
    
    @staticmethod
    async def revoke_sessions_by_jwt_jti(
        db: AsyncSession, 
        jwt_jtis: List[str]
    ) -> int:
        """Revoke sessions by JWT JTI list"""
        if not jwt_jtis:
            return 0
            
        placeholders = ",".join([f":jti_{i}" for i in range(len(jwt_jtis))])
        params = {f"jti_{i}": jti for i, jti in enumerate(jwt_jtis)}
        
        result = await db.execute(
            text(f"""
                UPDATE user_sessions 
                SET is_revoked = TRUE
                WHERE jwt_jti IN ({placeholders})
                AND is_revoked = FALSE
            """),
            params
        )
        
        await db.commit()
        return result.rowcount
    
    @staticmethod
    async def revoke_all_user_sessions(
        db: AsyncSession, 
        user_id: str, 
        exclude_session_id: Optional[str] = None
    ) -> int:
        """Revoke all sessions for a user except optionally one"""
        conditions = ["user_id = :user_id", "is_revoked = FALSE"]
        params = {"user_id": user_id}
        
        if exclude_session_id:
            conditions.append("id != :exclude_session_id")
            params["exclude_session_id"] = exclude_session_id
        
        result = await db.execute(
            text(f"""
                UPDATE user_sessions 
                SET is_revoked = TRUE
                WHERE {' AND '.join(conditions)}
            """),
            params
        )
        
        await db.commit()
        return result.rowcount
    
    @staticmethod
    async def cleanup_expired_sessions(db: AsyncSession) -> int:
        """Clean up expired sessions"""
        result = await db.execute(
            text("""
                DELETE FROM user_sessions 
                WHERE expires_at < NOW() - INTERVAL '30 days'
                OR (is_revoked = TRUE AND created_at < NOW() - INTERVAL '7 days')
            """)
        )
        
        await db.commit()
        return result.rowcount
    
    @staticmethod
    async def get_session_stats(db: AsyncSession, user_id: str) -> SessionStats:
        """Get session statistics for a user"""
        result = await db.execute(
            text("""
                SELECT 
                    COUNT(*) as total_sessions,
                    COUNT(*) FILTER (WHERE expires_at > NOW() AND is_revoked = FALSE) as active_sessions,
                    COUNT(*) FILTER (WHERE is_revoked = TRUE) as revoked_sessions,
                    COUNT(*) FILTER (WHERE expires_at <= NOW()) as expired_sessions,
                    COUNT(DISTINCT device_info->>'device_type') as unique_devices,
                    MAX(created_at) as most_recent_activity
                FROM user_sessions 
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        )
        
        row = result.fetchone()
        
        # Calculate average session duration
        duration_result = await db.execute(
            text("""
                SELECT AVG(
                    EXTRACT(EPOCH FROM LEAST(expires_at, COALESCE(updated_at, NOW())) - created_at) / 3600
                ) as avg_duration_hours
                FROM user_sessions 
                WHERE user_id = :user_id 
                AND created_at >= NOW() - INTERVAL '30 days'
            """),
            {"user_id": user_id}
        )
        
        duration_row = duration_result.fetchone()
        avg_duration = duration_row.avg_duration_hours if duration_row else None
        
        return SessionStats(
            total_sessions=row.total_sessions or 0,
            active_sessions=row.active_sessions or 0,
            revoked_sessions=row.revoked_sessions or 0,
            expired_sessions=row.expired_sessions or 0,
            unique_devices=row.unique_devices or 0,
            most_recent_activity=row.most_recent_activity,
            average_session_duration=float(avg_duration) if avg_duration else None
        )
