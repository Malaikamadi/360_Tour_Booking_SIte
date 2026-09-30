"""
NHIH 360° Discovery Tour - Programme API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Programme
from app.schemas.schemas import (
    ProgrammeCreate, ProgrammeUpdate, ProgrammeResponse, ProgrammeListResponse,
)
from app.core.dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/programmes", tags=["Programmes"])


@router.get("/", response_model=List[ProgrammeListResponse])
def list_programmes(
    programme_type: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    """List all programmes — publicly accessible for the booking form."""
    query = db.query(Programme)
    if active_only:
        query = query.filter(Programme.is_active == True)
    if programme_type:
        query = query.filter(Programme.programme_type == programme_type)
    return query.order_by(Programme.name).all()


@router.get("/{programme_id}", response_model=ProgrammeResponse)
def get_programme(programme_id: int, db: Session = Depends(get_db)):
    """Get programme details by ID."""
    programme = db.query(Programme).filter(Programme.id == programme_id).first()
    if not programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    return programme


@router.post("/", response_model=ProgrammeResponse, status_code=status.HTTP_201_CREATED)
def create_programme(
    programme: ProgrammeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """Create a new programme (admin only)."""
    existing = db.query(Programme).filter(Programme.name == programme.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Programme name already exists")

    db_programme = Programme(**programme.model_dump())
    db.add(db_programme)
    db.commit()
    db.refresh(db_programme)
    return db_programme


@router.put("/{programme_id}", response_model=ProgrammeResponse)
def update_programme(
    programme_id: int,
    programme: ProgrammeUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """Update programme details (admin only)."""
    db_programme = db.query(Programme).filter(Programme.id == programme_id).first()
    if not db_programme:
        raise HTTPException(status_code=404, detail="Programme not found")

    update_data = programme.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if value is not None:
            setattr(db_programme, key, value.value if hasattr(value, 'value') else value)

    db.commit()
    db.refresh(db_programme)
    return db_programme


@router.delete("/{programme_id}", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_programme(
    programme_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """Soft-delete a programme by deactivating it (admin only)."""
    db_programme = db.query(Programme).filter(Programme.id == programme_id).first()
    if not db_programme:
        raise HTTPException(status_code=404, detail="Programme not found")
    db_programme.is_active = False
    db.commit()
