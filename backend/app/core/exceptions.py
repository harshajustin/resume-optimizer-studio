"""
Custom Application Exceptions
"""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base application exception"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_type: str = "internal_error",
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_type = error_type
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(AppException):
    """Validation error"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=422,
            error_type="validation_error",
            details=details
        )


class AuthenticationError(AppException):
    """Authentication error"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            status_code=401,
            error_type="authentication_error"
        )


class AuthorizationError(AppException):
    """Authorization error"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            status_code=403,
            error_type="authorization_error"
        )


class NotFoundError(AppException):
    """Resource not found error"""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_type="not_found_error"
        )


class ConflictError(AppException):
    """Conflict error"""
    
    def __init__(self, message: str = "Resource conflict"):
        super().__init__(
            message=message,
            status_code=409,
            error_type="conflict_error"
        )


class FileUploadError(AppException):
    """File upload error"""
    
    def __init__(self, message: str = "File upload failed"):
        super().__init__(
            message=message,
            status_code=400,
            error_type="file_upload_error"
        )


class ExternalServiceError(AppException):
    """External service error"""
    
    def __init__(self, message: str = "External service error", service: str = "unknown"):
        super().__init__(
            message=message,
            status_code=502,
            error_type="external_service_error",
            details={"service": service}
        )


class RateLimitError(AppException):
    """Rate limit exceeded error"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(
            message=message,
            status_code=429,
            error_type="rate_limit_error"
        )
