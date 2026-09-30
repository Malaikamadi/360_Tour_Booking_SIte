"""
NHIH 360° Discovery Tour - Spaces API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import Space
from app.schemas.schemas import SpaceCreate, SpaceResponse
from app.core.dependencies import require_admin

router = APIRouter(prefix="/api/spaces", tags=["Spaces"])


@router.get("/", response_model=List[SpaceResponse])
def list_spaces(active_only: bool = True, db: Session = Depends(get_db)):
    """List available spaces for 360° engagements."""
    query = db.query(Space)
    if active_only:
        query = query.filter(Space.is_active == True)
    return query.order_by(Space.name).all()


@router.post("/", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
def create_space(
    space: SpaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """Register a new engagement room or space (Admin only)."""
    db_space = Space(**space.model_dump())
    db.add(db_space)
    db.commit()
    db.refresh(db_space)
    return db_space
