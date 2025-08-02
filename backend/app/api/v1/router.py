"""
API v1 Router
Main router that includes all v1 endpoints
"""

from fastapi import APIRouter

# Import all route modules
from app.api.v1.files import router as files_router
from app.api.v1.auth import router as auth_router
# from app.api.v1.users import router as users_router
# from app.api.v1.resumes import router as resumes_router
# from app.api.v1.jobs import router as jobs_router

# Create main API router
api_router = APIRouter()

# Include all route modules
api_router.include_router(files_router)
api_router.include_router(auth_router)
# api_router.include_router(users_router)
# api_router.include_router(resumes_router)
# api_router.include_router(jobs_router)
