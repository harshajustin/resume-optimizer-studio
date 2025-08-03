"""
DigitalOcean Spaces Storage Service
Handles file upload, download, and management
"""

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from typing import BinaryIO, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import structlog
from pathlib import Path

from app.core.config import settings
from app.core.exceptions import FileUploadError, ExternalServiceError

logger = structlog.get_logger()


class SpacesStorageService:
    """DigitalOcean Spaces storage service using S3-compatible API"""
    
    def __init__(self):
        """Initialize DigitalOcean Spaces client"""
        try:
            # Configure DigitalOcean Spaces client
            session = boto3.session.Session()
            self.client = session.client(
                's3',
                region_name=settings.DO_SPACES_REGION,
                endpoint_url=settings.DO_SPACES_ENDPOINT,
                aws_access_key_id=settings.DO_SPACES_ACCESS_KEY,
                aws_secret_access_key=settings.DO_SPACES_SECRET_KEY
            )
            self.bucket = settings.DO_SPACES_BUCKET_NAME
            logger.info("✅ DigitalOcean Spaces client initialized successfully")
            
        except NoCredentialsError:
            logger.error("❌ DigitalOcean Spaces credentials not found")
            raise ExternalServiceError(
                "DigitalOcean Spaces credentials not configured",
                service="digitalocean_spaces"
            )
        except Exception as e:
            logger.error("❌ Failed to initialize DigitalOcean Spaces client", error=str(e))
            raise ExternalServiceError(
                f"Failed to initialize storage service: {str(e)}",
                service="digitalocean_spaces"
            )
    
    def _generate_file_key(self, user_id: str, filename: str, folder: str = None) -> str:
        """Generate unique file key for storage"""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        file_extension = Path(filename).suffix
        
        # Create safe filename
        safe_filename = f"{timestamp}_{unique_id}{file_extension}"
        
        # Build key path
        if folder:
            key = f"{folder}/{user_id}/{safe_filename}"
        else:
            key = f"{settings.UPLOAD_FOLDER}/{user_id}/{safe_filename}"
        
        return key
    
    async def upload_file(
        self,
        file_content: BinaryIO,
        filename: str,
        user_id: str,
        content_type: str,
        folder: str = None,
        metadata: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Upload file to DigitalOcean Spaces
        
        Args:
            file_content: File binary content
            filename: Original filename
            user_id: User ID for organizing files
            content_type: MIME content type
            folder: Custom folder (optional)
            metadata: Additional metadata (optional)
        
        Returns:
            Dict with file information
        """
        try:
            # Generate unique file key
            file_key = self._generate_file_key(user_id, filename, folder)
            
            # Prepare metadata
            upload_metadata = {
                'user-id': user_id,
                'original-filename': filename,
                'upload-timestamp': datetime.utcnow().isoformat(),
                **(metadata or {})
            }
            
            # Upload to Spaces
            self.client.upload_fileobj(
                file_content,
                self.bucket,
                file_key,
                ExtraArgs={
                    'ContentType': content_type,
                    'Metadata': upload_metadata,
                    'ACL': 'private'  # Keep files private
                }
            )
            
            # Generate file URL
            file_url = f"{settings.DO_SPACES_ENDPOINT}/{self.bucket}/{file_key}"
            cdn_url = f"{settings.DO_SPACES_CDN_ENDPOINT}/{file_key}" if settings.DO_SPACES_CDN_ENDPOINT else None
            
            result = {
                'file_key': file_key,
                'file_url': file_url,
                'cdn_url': cdn_url,
                'bucket': self.bucket,
                'size': file_content.tell() if hasattr(file_content, 'tell') else None,
                'content_type': content_type,
                'metadata': upload_metadata
            }
            
            logger.info(
                "📤 File uploaded successfully",
                file_key=file_key,
                user_id=user_id,
                filename=filename
            )
            
            return result
            
        except ClientError as e:
            error_code = e.response['Error']['Code']
            logger.error(
                "❌ DigitalOcean Spaces upload failed",
                error_code=error_code,
                filename=filename,
                user_id=user_id
            )
            raise FileUploadError(f"Upload failed: {error_code}")
            
        except Exception as e:
            logger.error("❌ Unexpected upload error", error=str(e))
            raise FileUploadError(f"Upload failed: {str(e)}")
    
    async def generate_presigned_url(
        self,
        file_key: str,
        expiration: int = 3600,
        method: str = 'get_object'
    ) -> str:
        """
        Generate presigned URL for secure file access
        
        Args:
            file_key: File key in storage
            expiration: URL expiration time in seconds
            method: HTTP method (get_object, put_object)
        
        Returns:
            Presigned URL
        """
        try:
            url = self.client.generate_presigned_url(
                method,
                Params={'Bucket': self.bucket, 'Key': file_key},
                ExpiresIn=expiration
            )
            
            logger.info(
                "🔗 Presigned URL generated",
                file_key=file_key,
                expiration=expiration
            )
            
            return url
            
        except ClientError as e:
            logger.error("❌ Failed to generate presigned URL", error=str(e))
            raise ExternalServiceError(
                "Failed to generate download URL",
                service="digitalocean_spaces"
            )
    
    async def delete_file(self, file_key: str) -> bool:
        """
        Delete file from DigitalOcean Spaces
        
        Args:
            file_key: File key to delete
        
        Returns:
            True if successful
        """
        try:
            self.client.delete_object(Bucket=self.bucket, Key=file_key)
            logger.info("🗑️ File deleted successfully", file_key=file_key)
            return True
            
        except ClientError as e:
            logger.error("❌ Failed to delete file", file_key=file_key, error=str(e))
            return False
    
    async def file_exists(self, file_key: str) -> bool:
        """
        Check if file exists in storage
        
        Args:
            file_key: File key to check
        
        Returns:
            True if file exists
        """
        try:
            self.client.head_object(Bucket=self.bucket, Key=file_key)
            return True
        except ClientError:
            return False
    
    async def get_file_metadata(self, file_key: str) -> Optional[Dict[str, Any]]:
        """
        Get file metadata
        
        Args:
            file_key: File key
        
        Returns:
            File metadata dict or None
        """
        try:
            response = self.client.head_object(Bucket=self.bucket, Key=file_key)
            return {
                'size': response.get('ContentLength'),
                'content_type': response.get('ContentType'),
                'last_modified': response.get('LastModified'),
                'metadata': response.get('Metadata', {})
            }
        except ClientError:
            return None
    
    async def list_user_files(self, user_id: str, folder: str = None) -> list:
        """
        List all files for a user
        
        Args:
            user_id: User ID
            folder: Specific folder (optional)
        
        Returns:
            List of file information
        """
        try:
            prefix = f"{folder or settings.UPLOAD_FOLDER}/{user_id}/"
            
            response = self.client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix
            )
            
            files = []
            for obj in response.get('Contents', []):
                files.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'],
                    'url': f"{settings.DO_SPACES_ENDPOINT}/{self.bucket}/{obj['Key']}"
                })
            
            return files
            
        except ClientError as e:
            logger.error("❌ Failed to list user files", user_id=user_id, error=str(e))
            return []


# Global storage service instance
storage_service = SpacesStorageService()
