"""
NHIH 360° Discovery Tour - Engagement API Routes
Handles 3-day engagement lifecycles, milestone tracking, assessments,
data sources, operational challenges, and issue/value cases.
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime, date

from app.db.database import get_db
from app.models.models import (
    Engagement, Programme, Assessment, DataSource,
    OperationalChallenge, IssueValueCase, IntegrationRequirement,
    Intervention, Outcome, Booking
)
from app.schemas.schemas import (
    EngagementCreate, EngagementUpdate, EngagementResponse,
    AssessmentCreate, AssessmentResponse,
    DataSourceCreate, DataSourceResponse,
    OperationalChallengeCreate, OperationalChallengeResponse,
    IssueValueCaseCreate, IssueValueCaseResponse,
)
from app.core.dependencies import get_current_user, require_staff

router = APIRouter(prefix="/api/engagements", tags=["Engagements"])


@router.get("/")
def list_engagements(
    programme_id: Optional[int] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """List all engagements with programme details."""
    query = db.query(Engagement).options(
        joinedload(Engagement.programme),
        joinedload(Engagement.data_sources),
        joinedload(Engagement.operational_challenges),
        joinedload(Engagement.issue_value_cases),
        joinedload(Engagement.bookings),
    )

    if programme_id:
        query = query.filter(Engagement.programme_id == programme_id)
    if status_filter:
        query = query.filter(Engagement.status == status_filter)

    engagements = query.order_by(Engagement.created_at.desc()).all()

    results = []
    for eng in engagements:
        latest_booking = eng.bookings[0] if eng.bookings else None
        results.append({
            "id": eng.id,
            "programme_id": eng.programme_id,
            "programme_name": eng.programme.name if eng.programme else "Unknown",
            "programme_type": eng.programme.programme_type if eng.programme else None,
            "engagement_type": eng.engagement_type,
            "status": eng.status,
            "day1_complete": eng.day1_complete,
            "day2_complete": eng.day2_complete,
            "day3_complete": eng.day3_complete,
            "day1_notes": eng.day1_notes,
            "day2_notes": eng.day2_notes,
            "day3_notes": eng.day3_notes,
            "summary": eng.summary,
            "data_sources_count": len(eng.data_sources),
            "challenges_count": len(eng.operational_challenges),
            "issues_count": len(eng.issue_value_cases),
            "booking_reference": latest_booking.booking_reference if latest_booking else None,
            "requested_date": latest_booking.requested_date.isoformat() if latest_booking else None,
            "start_time": latest_booking.start_time.isoformat() if latest_booking else None,
            "end_time": latest_booking.end_time.isoformat() if latest_booking else None,
            "contact_person": latest_booking.contact_person if latest_booking else eng.programme.contact_person if eng.programme else None,
            "created_at": eng.created_at.isoformat() if eng.created_at else None,
            "updated_at": eng.updated_at.isoformat() if eng.updated_at else None,
        })
    return results


@router.get("/{engagement_id}")
def get_engagement_detail(
    engagement_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Get full engagement record with all nested discovery entities."""
    eng = (
        db.query(Engagement)
        .options(
            joinedload(Engagement.programme),
            joinedload(Engagement.data_sources),
            joinedload(Engagement.operational_challenges),
            joinedload(Engagement.issue_value_cases),
            joinedload(Engagement.assessments),
            joinedload(Engagement.integration_requirements),
            joinedload(Engagement.bookings),
            joinedload(Engagement.interventions).joinedload(Intervention.outcomes),
        )
        .filter(Engagement.id == engagement_id)
        .first()
    )

    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    return {
        "id": eng.id,
        "programme_id": eng.programme_id,
        "programme": {
            "id": eng.programme.id,
            "name": eng.programme.name,
            "programme_type": eng.programme.programme_type,
            "description": eng.programme.description,
            "contact_person": eng.programme.contact_person,
            "contact_email": eng.programme.contact_email,
            "contact_phone": eng.programme.contact_phone,
        } if eng.programme else None,
        "engagement_type": eng.engagement_type,
        "status": eng.status,
        "day1_complete": eng.day1_complete,
        "day2_complete": eng.day2_complete,
        "day3_complete": eng.day3_complete,
        "day1_notes": eng.day1_notes,
        "day2_notes": eng.day2_notes,
        "day3_notes": eng.day3_notes,
        "summary": eng.summary,
        "created_at": eng.created_at.isoformat() if eng.created_at else None,
        "updated_at": eng.updated_at.isoformat() if eng.updated_at else None,
        "bookings": [
            {
                "id": b.id,
                "booking_reference": b.booking_reference,
                "requested_date": b.requested_date.isoformat(),
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat(),
                "location": b.location,
                "contact_person": b.contact_person,
                "contact_email": b.contact_email,
                "contact_phone": b.contact_phone,
                "participant_count": b.participant_count,
                "status": b.status,
                "additional_requirements": b.additional_requirements,
            }
            for b in eng.bookings
        ],
        "assessments": [
            {
                "id": a.id,
                "assessment_type": a.assessment_type,
                "findings": a.findings,
                "recommendations": a.recommendations,
                "assessed_by": a.assessed_by,
                "assessed_date": a.assessed_date.isoformat() if a.assessed_date else None,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in eng.assessments
        ],
        "data_sources": [
            {
                "id": ds.id,
                "name": ds.name,
                "system_type": ds.system_type,
                "description": ds.description,
                "data_format": ds.data_format,
                "data_frequency": ds.data_frequency,
                "data_owner": ds.data_owner,
                "integration_status": ds.integration_status,
                "created_at": ds.created_at.isoformat() if ds.created_at else None,
            }
            for ds in eng.data_sources
        ],
        "operational_challenges": [
            {
                "id": oc.id,
                "title": oc.title,
                "description": oc.description,
                "severity": oc.severity,
                "status": oc.status,
                "created_at": oc.created_at.isoformat() if oc.created_at else None,
            }
            for oc in eng.operational_challenges
        ],
        "issue_value_cases": [
            {
                "id": ivc.id,
                "title": ivc.title,
                "description": ivc.description,
                "case_type": ivc.case_type,
                "priority": ivc.priority,
                "status": ivc.status,
                "resolution": ivc.resolution,
                "created_at": ivc.created_at.isoformat() if ivc.created_at else None,
            }
            for ivc in eng.issue_value_cases
        ],
        "integration_requirements": [
            {
                "id": ir.id,
                "source_system": ir.source_system,
                "target_system": ir.target_system,
                "description": ir.description,
                "priority": ir.priority,
                "status": ir.status,
            }
            for ir in eng.integration_requirements
        ],
        "interventions": [
            {
                "id": it.id,
                "title": it.title,
                "description": it.description,
                "assigned_to": it.assigned_to,
                "status": it.status,
                "due_date": it.due_date.isoformat() if it.due_date else None,
                "outcomes": [
                    {
                        "id": o.id,
                        "description": o.description,
                        "impact": o.impact,
                        "status": o.status,
                    }
                    for o in it.outcomes
                ],
            }
            for it in eng.interventions
        ],
    }


@router.put("/{engagement_id}/milestones")
def update_engagement_milestones(
    engagement_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Mark Day 1, Day 2, or Day 3 complete with accompanying notes."""
    eng = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    if "day1_complete" in payload:
        eng.day1_complete = bool(payload["day1_complete"])
    if "day2_complete" in payload:
        eng.day2_complete = bool(payload["day2_complete"])
    if "day3_complete" in payload:
        eng.day3_complete = bool(payload["day3_complete"])

    if "day1_notes" in payload and payload["day1_notes"] is not None:
        eng.day1_notes = payload["day1_notes"]
    if "day2_notes" in payload and payload["day2_notes"] is not None:
        eng.day2_notes = payload["day2_notes"]
    if "day3_notes" in payload and payload["day3_notes"] is not None:
        eng.day3_notes = payload["day3_notes"]
    if "summary" in payload and payload["summary"] is not None:
        eng.summary = payload["summary"]

    # Automatically progress status
    if eng.day1_complete and eng.day2_complete and eng.day3_complete:
        eng.status = "completed"
    elif eng.day1_complete or eng.day2_complete:
        eng.status = "in_progress"

    db.commit()
    db.refresh(eng)
    return {"message": "Milestones updated successfully", "id": eng.id, "status": eng.status}


@router.post("/{engagement_id}/assessments")
def add_assessment(
    engagement_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Record findings and recommendations for an engagement."""
    eng = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    assessment = Assessment(
        engagement_id=engagement_id,
        assessment_type=payload.get("assessment_type", "Operational Data Readiness"),
        findings=payload.get("findings", ""),
        recommendations=payload.get("recommendations", ""),
        assessed_by=payload.get("assessed_by", current_user.full_name if current_user else "NHIH Staff"),
        assessed_date=date.today(),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return {"message": "Findings recorded successfully", "id": assessment.id}


@router.post("/{engagement_id}/data-sources")
def add_data_source(
    engagement_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Register a newly mapped data source during discovery."""
    eng = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    ds = DataSource(
        engagement_id=engagement_id,
        programme_id=eng.programme_id,
        name=payload["name"],
        system_type=payload.get("system_type", "Database"),
        description=payload.get("description"),
        data_format=payload.get("data_format", "Digital"),
        data_frequency=payload.get("data_frequency", "Monthly"),
        data_owner=payload.get("data_owner", eng.programme.contact_person if eng.programme else None),
        integration_status=payload.get("integration_status", "not_integrated"),
    )
    db.add(ds)
    db.commit()
    db.refresh(ds)
    return {"message": "Data source added", "id": ds.id}


@router.post("/{engagement_id}/challenges")
def add_operational_challenge(
    engagement_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Log an operational challenge identified during the engagement."""
    eng = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    challenge = OperationalChallenge(
        engagement_id=engagement_id,
        programme_id=eng.programme_id,
        title=payload["title"],
        description=payload.get("description"),
        severity=payload.get("severity", "medium"),
        status=payload.get("status", "open"),
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return {"message": "Operational challenge logged", "id": challenge.id}


@router.post("/{engagement_id}/issues")
def add_issue_value_case(
    engagement_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_staff),
):
    """Log an issue or value case."""
    eng = db.query(Engagement).filter(Engagement.id == engagement_id).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engagement not found")

    ivc = IssueValueCase(
        engagement_id=engagement_id,
        programme_id=eng.programme_id,
        title=payload["title"],
        description=payload.get("description"),
        case_type=payload.get("case_type", "issue"),
        priority=payload.get("priority", "medium"),
        status=payload.get("status", "open"),
        resolution=payload.get("resolution"),
    )
    db.add(ivc)
    db.commit()
    db.refresh(ivc)
    return {"message": "Record saved", "id": ivc.id}
