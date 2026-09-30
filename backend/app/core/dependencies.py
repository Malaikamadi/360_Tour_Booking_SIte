"""
NHIH 360° Discovery Tour - FastAPI Dependencies
Dependency injection for authentication, authorization, and database sessions.
"""
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.security import oauth2_scheme, decode_access_token, Roles
from app.db.database import get_db


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Extract and validate the current user from the JWT token."""
    from app.models.models import User

    payload = decode_access_token(token)
    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )
    return user


def get_optional_user(request: Request, db: Session = Depends(get_db)):
    """Optionally extract the current user — returns None for anonymous access."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split(" ")[1]
    try:
        from app.models.models import User
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id:
            return db.query(User).filter(User.id == int(user_id)).first()
    except Exception:
        pass
    return None


class RoleChecker:
    """Dependency that enforces role-based access control."""

    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user=Depends(get_current_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user


# Convenience dependencies
require_staff = RoleChecker(Roles.STAFF_AND_ABOVE)
require_admin = RoleChecker(Roles.ADMIN_ONLY)
require_any_authenticated = RoleChecker(Roles.ALL)
