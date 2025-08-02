"""
Session Models
Pydantic models for user session management
"""

from pydantic import BaseModel, Field, IPvAnyAddress
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID


class DeviceInfo(BaseModel):
    """Device information model"""
    device_type: Optional[str] = None  # "desktop", "mobile", "tablet"
    os: Optional[str] = None
    browser: Optional[str] = None
    browser_version: Optional[str] = None
    user_agent: Optional[str] = None
    screen_resolution: Optional[str] = None
    timezone: Optional[str] = None


class SessionCreate(BaseModel):
    """Session creation model"""
    device_info: Optional[DeviceInfo] = None
    ip_address: Optional[IPvAnyAddress] = None


class SessionResponse(BaseModel):
    """Session response model"""
    id: str
    user_id: str
    device_info: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    expires_at: datetime
    is_revoked: bool
    created_at: datetime
    last_activity: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ActiveSessionsResponse(BaseModel):
    """Active sessions list response"""
    sessions: list[SessionResponse]
    total_count: int
    current_session_id: Optional[str] = None


class SessionRevoke(BaseModel):
    """Session revocation model"""
    session_id: str
    reason: Optional[str] = "user_requested"


class BulkSessionRevoke(BaseModel):
    """Bulk session revocation model"""
    session_ids: list[str]
    reason: Optional[str] = "user_requested"
    exclude_current: bool = True


class SessionActivity(BaseModel):
    """Session activity model"""
    session_id: str
    activity_type: str = "page_view"  # "page_view", "api_call", "download", etc.
    resource: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class SessionStats(BaseModel):
    """Session statistics model"""
    total_sessions: int
    active_sessions: int
    revoked_sessions: int
    expired_sessions: int
    unique_devices: int
    most_recent_activity: Optional[datetime] = None
    average_session_duration: Optional[float] = None  # in hours


class SessionSecurity(BaseModel):
    """Session security information"""
    suspicious_activities: list[Dict[str, Any]]
    login_attempts: int
    last_failed_login: Optional[datetime] = None
    account_locked: bool = False
    lock_expires_at: Optional[datetime] = None
