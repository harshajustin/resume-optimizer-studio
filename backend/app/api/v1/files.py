"""
File Upload API Endpoints
Handles resume and document uploads to DigitalOcean Spaces
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List, Optional
import aiofiles
import magic
from pathlib import Path
import structlog

from app.core.config import settings
from app.core.exceptions import FileUploadError, ValidationError
from app.services.storage import storage_service
from app.api.dependencies import get_current_user
from app.models.user import User

logger = structlog.get_logger()
router = APIRouter(prefix="/files", tags=["files"])


def validate_file_type(file: UploadFile) -> str:
    """Validate file type and return MIME type"""
    
    # Check file extension
    file_extension = Path(file.filename).suffix.lower().lstrip('.')
    if file_extension not in settings.allowed_file_types_list:
        raise ValidationError(
            f"File type '{file_extension}' not allowed. "
            f"Allowed types: {', '.join(settings.allowed_file_types_list)}"
        )
    
    # Validate MIME type if available
    if file.content_type:
        allowed_mime_types = {
            'pdf': ['application/pdf'],
            'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            'doc': ['application/msword'],
            'txt': ['text/plain']
        }
        
        expected_types = allowed_mime_types.get(file_extension, [])
        if expected_types and file.content_type not in expected_types:
            logger.warning(
                "MIME type mismatch",
                filename=file.filename,
                expected=expected_types,
                actual=file.content_type
            )
    
    return file.content_type or f"application/{file_extension}"


async def validate_file_content(file: UploadFile) -> None:
    """Validate file content using python-magic"""
    try:
        # Read first 2048 bytes for magic number detection
        content_sample = await file.read(2048)
        await file.seek(0)  # Reset file pointer
        
        # Detect file type using magic
        detected_type = magic.from_buffer(content_sample, mime=True)
        file_extension = Path(file.filename).suffix.lower().lstrip('.')
        
        # Map extensions to expected MIME types
        expected_types = {
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'txt': 'text/plain'
        }
        
        expected_type = expected_types.get(file_extension)
        if expected_type and detected_type != expected_type:
            # Some flexibility for text files and Office docs
            if not (
                (file_extension == 'txt' and detected_type.startswith('text/')) or
                (file_extension in ['doc', 'docx'] and 'officedocument' in detected_type)
            ):
                raise ValidationError(
                    f"File content doesn't match extension. "
                    f"Expected: {expected_type}, Detected: {detected_type}"
                )
        
        logger.info(
            "File content validated",
            filename=file.filename,
            detected_type=detected_type
        )
        
    except Exception as e:
        logger.error("File content validation failed", error=str(e))
        # Don't fail upload for validation issues, just log
        pass


@router.post("/upload/resume")
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
) -> JSONResponse:
    """
    Upload a resume file to DigitalOcean Spaces
    """
    try:
        # Validate file size
        if hasattr(file, 'size') and file.size > settings.max_file_size_bytes:
            raise ValidationError(
                f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB"
            )
        
        # Validate file type
        content_type = validate_file_type(file)
        
        # Validate file content
        await validate_file_content(file)
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        
        # Additional size check after reading
        if file_size > settings.max_file_size_bytes:
            raise ValidationError(
                f"File size ({file_size / 1024 / 1024:.1f}MB) exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB"
            )
        
        # Reset file pointer for upload
        await file.seek(0)
        
        # Upload to DigitalOcean Spaces
        upload_result = await storage_service.upload_file(
            file_content=file.file,
            filename=file.filename,
            user_id=str(current_user.id),
            content_type=content_type,
            folder="resumes",
            metadata={
                "file-type": "resume",
                "user-email": current_user.email,
                "file-size": str(file_size)
            }
        )
        
        # TODO: Save file info to database
        # TODO: Queue background task for AI processing
        
        logger.info(
            "📄 Resume uploaded successfully",
            user_id=current_user.id,
            filename=file.filename,
            file_size=file_size,
            file_key=upload_result['file_key']
        )
        
        return JSONResponse(
            status_code=201,
            content={
                "message": "Resume uploaded successfully",
                "file_id": upload_result['file_key'],
                "file_url": upload_result['file_url'],
                "cdn_url": upload_result['cdn_url'],
                "size": file_size,
                "content_type": content_type
            }
        )
        
    except ValidationError:
        raise
    except FileUploadError:
        raise
    except Exception as e:
        logger.error("❌ Resume upload failed", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=500,
            detail="Upload failed due to server error"
        )


@router.get("/download/{file_key}")
async def download_file(
    file_key: str,
    current_user: User = Depends(get_current_user)
) -> JSONResponse:
    """
    Generate a presigned download URL for a file
    """
    try:
        # TODO: Verify user owns this file by checking database
        
        # Check if file exists
        if not await storage_service.file_exists(file_key):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Generate presigned URL (valid for 1 hour)
        download_url = await storage_service.generate_presigned_url(
            file_key=file_key,
            expiration=3600
        )
        
        logger.info(
            "🔗 Download URL generated",
            user_id=current_user.id,
            file_key=file_key
        )
        
        return JSONResponse(content={
            "download_url": download_url,
            "expires_in": 3600
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("❌ Download URL generation failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to generate download URL"
        )


@router.delete("/{file_key}")
async def delete_file(
    file_key: str,
    current_user: User = Depends(get_current_user)
) -> JSONResponse:
    """
    Delete a file from storage
    """
    try:
        # TODO: Verify user owns this file by checking database
        
        # Delete from storage
        success = await storage_service.delete_file(file_key)
        
        if not success:
            raise HTTPException(status_code=404, detail="File not found or already deleted")
        
        # TODO: Update database to mark file as deleted
        
        logger.info(
            "🗑️ File deleted",
            user_id=current_user.id,
            file_key=file_key
        )
        
        return JSONResponse(content={
            "message": "File deleted successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("❌ File deletion failed", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to delete file"
        )


@router.get("/list")
async def list_user_files(
    current_user: User = Depends(get_current_user)
) -> JSONResponse:
    """
    List all files for the current user
    """
    try:
        files = await storage_service.list_user_files(str(current_user.id))
        
        return JSONResponse(content={
            "files": files,
            "total": len(files)
        })
        
    except Exception as e:
        logger.error("❌ Failed to list user files", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve file list"
        )


@router.get("/{file_key}/metadata")
async def get_file_metadata(
    file_key: str,
    current_user: User = Depends(get_current_user)
) -> JSONResponse:
    """
    Get file metadata
    """
    try:
        # TODO: Verify user owns this file
        
        metadata = await storage_service.get_file_metadata(file_key)
        
        if not metadata:
            raise HTTPException(status_code=404, detail="File not found")
        
        return JSONResponse(content=metadata)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("❌ Failed to get file metadata", error=str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve file metadata"
        )
