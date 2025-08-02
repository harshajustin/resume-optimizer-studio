"""
User Model
Pydantic models for user-related data
"""

from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SubscriptionTier(str, Enum):
    """User subscription tiers"""
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class User(BaseModel):
    """User model"""
    id: UUID4
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = True
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    created_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    """User creation model"""
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserUpdate(BaseModel):
    """User update model"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    subscription_tier: Optional[SubscriptionTier] = None


class UserResponse(BaseModel):
    """User response model (excludes sensitive data)"""
    id: UUID4
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    subscription_tier: SubscriptionTier
    is_active: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
