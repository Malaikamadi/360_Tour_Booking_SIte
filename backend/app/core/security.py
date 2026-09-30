"""
NHIH 360° Discovery Tour - Security & Authentication
JWT token management, password hashing, and role-based access control.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
import os
import hashlib
import secrets
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ---------------------------------------------------------------------------
# Password utilities (PBKDF2-HMAC-SHA256 with fallback verification)
# ---------------------------------------------------------------------------
def get_password_hash(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with 100,000 iterations."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2_sha256${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash."""
    if not hashed_password:
        return False
    if hashed_password.startswith("pbkdf2_sha256$"):
        try:
            parts = hashed_password.split("$")
            if len(parts) == 3:
                salt = parts[1]
                key = parts[2]
                computed = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
                return secrets.compare_digest(key, computed.hex())
        except Exception:
            return False
    # Fallback to bcrypt if existing
    try:
        import bcrypt
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        pass
    # Fallback to plain equality for initial development testing if applicable
    return plain_password == hashed_password


# ---------------------------------------------------------------------------
# JWT token utilities
# ---------------------------------------------------------------------------
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# Role definitions
# ---------------------------------------------------------------------------
class Roles:
    PUBLIC = "public"
    PROGRAMME_USER = "programme_user"
    NHIH_STAFF = "nhih_staff"
    NHIH_ADMIN = "nhih_admin"

    ALL = [PUBLIC, PROGRAMME_USER, NHIH_STAFF, NHIH_ADMIN]
    STAFF_AND_ABOVE = [NHIH_STAFF, NHIH_ADMIN]
    ADMIN_ONLY = [NHIH_ADMIN]
