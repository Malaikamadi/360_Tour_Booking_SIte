"""
NHIH 360° Discovery Tour - Booking API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date, time
from app.db.database import get_db
from app.models.models import Booking
from app.schemas.schemas import (
    BookingCreate, BookingUpdate, BookingResponse, BookingListResponse,
    AvailabilityRequest, AvailabilityResponse, PaginatedResponse,
)
from app.services.booking_service import (
    create_booking, check_availability, update_booking_status,
    reschedule_booking, get_bookings,
)
from app.core.dependencies import get_current_user, get_optional_user, require_staff

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("/check-availability", response_model=AvailabilityResponse)
def check_slot_availability(
    request: AvailabilityRequest,
    db: Session = Depends(get_db),
):
    """Check if a specific date/time slot is available. Publicly accessible."""
    return check_availability(
        db,
        request.requested_date,
        request.start_time,
        request.end_time,
        request.space_id,
    )


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_new_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_optional_user),
):
    """
    Create a new 360° engagement booking.
    Accessible by both authenticated and anonymous users.
    Uses PostgreSQL advisory locks to prevent double-booking.
    """
    user_id = current_user.id if current_user else None
    new_booking = create_booking(db, booking, user_id)

    # Attach programme name for response
    response = BookingResponse.model_validate(new_booking)
    response.programme_name = new_booking.programme.name if new_booking.programme else None
    return response


@router.get("/", response_model=PaginatedResponse)
def list_bookings(
    programme_id: Optional[int] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """List all bookings with filters (staff only)."""
    bookings, total = get_bookings(
        db, programme_id, status_filter, date_from, date_to, page, per_page
    )

    items = []
    for b in bookings:
        item = BookingListResponse.model_validate(b)
        item.programme_name = b.programme.name if b.programme else None
        items.append(item)

    return PaginatedResponse(
        items=[item.model_dump() for item in items],
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page,
    )


@router.get("/reference/{booking_reference}", response_model=BookingResponse)
def get_booking_by_reference(
    booking_reference: str,
    db: Session = Depends(get_db),
):
    """Look up a booking by its reference number. Publicly accessible."""
    booking = (
        db.query(Booking)
        .filter(Booking.booking_reference == booking_reference)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    response = BookingResponse.model_validate(booking)
    response.programme_name = booking.programme.name if booking.programme else None
    return response


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Get booking details by ID (staff only)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    response = BookingResponse.model_validate(booking)
    response.programme_name = booking.programme.name if booking.programme else None
    return response


@router.put("/{booking_id}/status")
def update_status(
    booking_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Update booking status (staff only)."""
    booking = update_booking_status(db, booking_id, new_status)
    return {"message": f"Booking status updated to {new_status}", "booking_reference": booking.booking_reference}


@router.put("/{booking_id}/reschedule", response_model=BookingResponse)
def reschedule(
    booking_id: int,
    new_date: date = Query(...),
    new_start_time: time = Query(...),
    new_end_time: time = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Reschedule a booking to a new date/time (staff only)."""
    booking = reschedule_booking(db, booking_id, new_date, new_start_time, new_end_time)
    response = BookingResponse.model_validate(booking)
    response.programme_name = booking.programme.name if booking.programme else None
    return response


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Cancel a booking (staff only)."""
    update_booking_status(db, booking_id, "cancelled")
