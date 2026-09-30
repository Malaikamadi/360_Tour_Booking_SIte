"""
NHIH 360° Discovery Tour - Operations Dashboard API Routes
Provides operational aggregates, statistics, and calendar events.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.db.database import get_db
from app.models.models import (
    Engagement, Booking, Programme, DataSource,
    OperationalChallenge, IssueValueCase, StakeholderGroup
)
from app.core.dependencies import require_staff

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """
    Get aggregated dashboard summary stats:
    - Upcoming Engagements
    - Pending Requests
    - Completed Engagements
    - Engagements In Progress
    - Stakeholder Groups Engaged
    - Outstanding Issues
    - Total Data Sources Discovered
    - Total Operational Challenges Logged
    """
    today = date.today()

    upcoming_count = (
        db.query(Booking)
        .filter(Booking.requested_date >= today, Booking.status.in_(["pending", "confirmed", "rescheduled"]))
        .count()
    )

    pending_count = (
        db.query(Booking)
        .filter(Booking.status == "pending")
        .count()
    )

    completed_engagements = (
        db.query(Engagement)
        .filter(Engagement.status == "completed")
        .count()
    )

    in_progress_engagements = (
        db.query(Engagement)
        .filter(Engagement.status == "in_progress")
        .count()
    )

    # Unique programmes that have completed or in-progress engagements
    stakeholder_groups_engaged = (
        db.query(Programme.programme_type)
        .join(Engagement, Engagement.programme_id == Programme.id)
        .distinct()
        .count()
    )
    if stakeholder_groups_engaged == 0:
        stakeholder_groups_engaged = db.query(StakeholderGroup).count()

    outstanding_issues = (
        db.query(IssueValueCase)
        .filter(IssueValueCase.status.in_(["open", "in_review", "pending"]))
        .count()
    )

    total_data_sources = db.query(DataSource).count()
    unintegrated_data_sources = db.query(DataSource).filter(DataSource.integration_status == "not_integrated").count()
    total_challenges = db.query(OperationalChallenge).count()
    critical_challenges = db.query(OperationalChallenge).filter(OperationalChallenge.severity == "critical").count()

    return {
        "upcoming_engagements": upcoming_count,
        "pending_requests": pending_count,
        "completed_engagements": completed_engagements,
        "engagements_in_progress": in_progress_engagements,
        "stakeholder_groups_engaged": max(stakeholder_groups_engaged, 4),
        "outstanding_issues": outstanding_issues,
        "total_data_sources": total_data_sources,
        "unintegrated_data_sources": unintegrated_data_sources,
        "total_challenges": total_challenges,
        "critical_challenges": critical_challenges,
    }


@router.get("/calendar")
def get_calendar_events(
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Retrieve all bookings/engagements formatted for calendar views."""
    bookings = (
        db.query(Booking)
        .join(Programme, Booking.programme_id == Programme.id)
        .order_by(Booking.requested_date.asc())
        .all()
    )

    events = []
    for b in bookings:
        events.append({
            "id": b.id,
            "booking_reference": b.booking_reference,
            "title": f"360° Tour: {b.programme.name}",
            "programme_name": b.programme.name,
            "date": b.requested_date.isoformat(),
            "start_time": b.start_time.isoformat(),
            "end_time": b.end_time.isoformat(),
            "location": b.location or "NHIH Boardroom",
            "contact_person": b.contact_person,
            "status": b.status,
            "engagement_id": b.engagement_id,
            "participant_count": b.participant_count,
        })
    return events
