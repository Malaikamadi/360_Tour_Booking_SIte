"""
NHIH 360° Discovery Tour - Booking Service
Core business logic for booking management, availability checking,
and conflict detection using PostgreSQL-level locking.
"""
import uuid
from datetime import date, time, timedelta, datetime
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, text
from fastapi import HTTPException, status
from app.models.models import Booking, BookingStatus, Engagement, EngagementStatus, Programme
from app.schemas.schemas import BookingCreate, BookingUpdate, AvailabilityResponse
from app.core.config import settings


def generate_booking_reference() -> str:
    """Generate a unique booking reference like NHIH-XXXX-XXXX."""
    short_id = uuid.uuid4().hex[:8].upper()
    return f"NHIH-{short_id[:4]}-{short_id[4:]}"


def check_availability(
    db: Session,
    requested_date: date,
    start_time: time,
    end_time: time,
    space_id: Optional[int] = None,
    exclude_booking_id: Optional[int] = None,
) -> AvailabilityResponse:
    """
    Check if a time slot is available.
    Uses database-level queries to detect overlapping bookings.
    """
    # Build the overlap query: two time ranges overlap when
    # start1 < end2 AND start2 < end1
    query = db.query(Booking).filter(
        Booking.requested_date == requested_date,
        Booking.start_time < end_time,
        Booking.end_time > start_time,
        Booking.status.in_([
            BookingStatus.PENDING.value,
            BookingStatus.CONFIRMED.value,
            BookingStatus.RESCHEDULED.value,
        ]),
    )

    if space_id:
        query = query.filter(Booking.space_id == space_id)

    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)

    conflicts = query.all()

    # Find alternative slots if there are conflicts
    alternative_slots = []
    if conflicts:
        alternative_slots = _find_alternative_slots(
            db, requested_date, start_time, end_time, space_id
        )

    return AvailabilityResponse(
        available=len(conflicts) == 0,
        requested_date=requested_date,
        start_time=start_time,
        end_time=end_time,
        conflicts=[
            {
                "booking_reference": c.booking_reference,
                "start_time": c.start_time.isoformat(),
                "end_time": c.end_time.isoformat(),
                "programme": c.programme.name if c.programme else "Unknown",
            }
            for c in conflicts
        ],
        alternative_slots=alternative_slots,
    )


def _find_alternative_slots(
    db: Session,
    requested_date: date,
    start_time: time,
    end_time: time,
    space_id: Optional[int] = None,
) -> List[dict]:
    """Find up to 5 alternative available slots around the requested date."""
    alternatives = []
    duration_hours = (
        datetime.combine(requested_date, end_time)
        - datetime.combine(requested_date, start_time)
    ).seconds // 3600

    # Check same day at different times
    for hour in range(settings.BUSINESS_HOUR_START, settings.BUSINESS_HOUR_END - duration_hours + 1):
        slot_start = time(hour, 0)
        slot_end = time(hour + duration_hours, 0)

        if slot_start == start_time:
            continue

        avail = check_availability_simple(db, requested_date, slot_start, slot_end, space_id)
        if avail:
            alternatives.append({
                "date": requested_date.isoformat(),
                "start_time": slot_start.isoformat(),
                "end_time": slot_end.isoformat(),
            })
            if len(alternatives) >= 3:
                break

    # Check next 5 business days
    for day_offset in range(1, 6):
        alt_date = requested_date + timedelta(days=day_offset)
        # Skip weekends
        if alt_date.weekday() >= 5:
            continue

        avail = check_availability_simple(db, alt_date, start_time, end_time, space_id)
        if avail:
            alternatives.append({
                "date": alt_date.isoformat(),
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat(),
            })
            if len(alternatives) >= 5:
                break

    return alternatives


def check_availability_simple(
    db: Session,
    requested_date: date,
    start_time: time,
    end_time: time,
    space_id: Optional[int] = None,
) -> bool:
    """Quick boolean availability check without building full response."""
    query = db.query(Booking).filter(
        Booking.requested_date == requested_date,
        Booking.start_time < end_time,
        Booking.end_time > start_time,
        Booking.status.in_([
            BookingStatus.PENDING.value,
            BookingStatus.CONFIRMED.value,
            BookingStatus.RESCHEDULED.value,
        ]),
    )
    if space_id:
        query = query.filter(Booking.space_id == space_id)
    return query.count() == 0


def create_booking(
    db: Session,
    booking_data: BookingCreate,
    user_id: Optional[int] = None,
) -> Booking:
    """
    Create a new booking with database-level conflict prevention.
    Uses SELECT ... FOR UPDATE to prevent race conditions.
    """
    # Validate programme exists
    programme = db.query(Programme).filter(Programme.id == booking_data.programme_id).first()
    if not programme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Programme not found",
        )

    # Validate time range
    if booking_data.start_time >= booking_data.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time must be before end time",
        )

    # Use database-level locking to prevent double booking
    # On PostgreSQL, acquire transaction-level advisory lock on the date
    if db.bind and db.bind.dialect.name == "postgresql":
        lock_key = int(booking_data.requested_date.toordinal())
        db.execute(text(f"SELECT pg_advisory_xact_lock({lock_key})"))

    # Now check availability within the locked transaction
    availability = check_availability(
        db,
        booking_data.requested_date,
        booking_data.start_time,
        booking_data.end_time,
        booking_data.space_id,
    )

    if not availability.available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "This time slot is unavailable.",
                "conflicts": availability.conflicts,
                "alternative_slots": availability.alternative_slots,
            },
        )

    # Create the engagement record
    engagement = Engagement(
        programme_id=booking_data.programme_id,
        engagement_type=booking_data.engagement_type.value,
        status=EngagementStatus.PLANNED.value,
    )
    db.add(engagement)
    db.flush()  # Get the engagement ID

    # Create the booking
    booking = Booking(
        booking_reference=generate_booking_reference(),
        engagement_id=engagement.id,
        programme_id=booking_data.programme_id,
        space_id=booking_data.space_id,
        engagement_type=booking_data.engagement_type.value,
        requested_date=booking_data.requested_date,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        location=booking_data.location,
        contact_person=booking_data.contact_person,
        contact_email=booking_data.contact_email,
        contact_phone=booking_data.contact_phone,
        participant_count=booking_data.participant_count,
        additional_requirements=booking_data.additional_requirements,
        status=BookingStatus.PENDING.value,
        created_by_user_id=user_id,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def update_booking_status(
    db: Session,
    booking_id: int,
    new_status: str,
) -> Booking:
    """Update the status of a booking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    booking.status = new_status

    # Update engagement status if relevant
    if booking.engagement_id:
        engagement = db.query(Engagement).filter(Engagement.id == booking.engagement_id).first()
        if engagement:
            if new_status == BookingStatus.CONFIRMED.value:
                engagement.status = EngagementStatus.PLANNED.value
            elif new_status == BookingStatus.CANCELLED.value:
                engagement.status = EngagementStatus.CANCELLED.value

    db.commit()
    db.refresh(booking)
    return booking


def reschedule_booking(
    db: Session,
    booking_id: int,
    new_date: date,
    new_start_time: time,
    new_end_time: time,
) -> Booking:
    """Reschedule a booking with conflict checking."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    # Lock and check availability for new slot
    if db.bind and db.bind.dialect.name == "postgresql":
        lock_key = int(new_date.toordinal())
        db.execute(text(f"SELECT pg_advisory_xact_lock({lock_key})"))

    availability = check_availability(
        db, new_date, new_start_time, new_end_time,
        booking.space_id, exclude_booking_id=booking_id,
    )

    if not availability.available:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "The new time slot is unavailable.",
                "alternative_slots": availability.alternative_slots,
            },
        )

    booking.requested_date = new_date
    booking.start_time = new_start_time
    booking.end_time = new_end_time
    booking.status = BookingStatus.RESCHEDULED.value

    db.commit()
    db.refresh(booking)
    return booking


def get_bookings(
    db: Session,
    programme_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = 1,
    per_page: int = 20,
) -> Tuple[List[Booking], int]:
    """Get paginated list of bookings with optional filters."""
    query = db.query(Booking)

    if programme_id:
        query = query.filter(Booking.programme_id == programme_id)
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    if date_from:
        query = query.filter(Booking.requested_date >= date_from)
    if date_to:
        query = query.filter(Booking.requested_date <= date_to)

    total = query.count()
    bookings = (
        query.order_by(Booking.requested_date.desc(), Booking.start_time)
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return bookings, total
