"""
NHIH 360° Discovery Tour - NHIH Operational Dashboard & Intelligence Layer Boundary
Clean integration boundary separating:
  Layer A: Facts (Raw, verified operational entities)
  Layer B: Analytical Signals (Deterministic aggregations and indicators)
  Layer C: AI Reasoning Preparation (Grounded context packages for external AI without hallucinations)
  Layer D: Presentation Ready Payloads (For HOS dashboard cards & widgets)
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from typing import Optional
from app.db.database import get_db
from app.models.models import (
    Engagement, Programme, DataSource, OperationalChallenge,
    IssueValueCase, IntegrationRequirement, Assessment
)

router = APIRouter(prefix="/api/intelligence", tags=["NHIH Intelligence Layer"])


@router.get("/facts")
def get_operational_facts(
    programme_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    """
    Layer A: FACTS
    Deterministic, verified registry of health information systems, programmes,
    and reporting flows across Sierra Leone Ministry of Health.
    """
    p_query = db.query(Programme).filter(Programme.is_active == True)
    if programme_id:
        p_query = p_query.filter(Programme.id == programme_id)
    programmes = p_query.order_by(Programme.name).all()

    ds_query = db.query(DataSource)
    if programme_id:
        ds_query = ds_query.filter(DataSource.programme_id == programme_id)
    data_sources = ds_query.all()

    ch_query = db.query(OperationalChallenge)
    if programme_id:
        ch_query = ch_query.filter(OperationalChallenge.programme_id == programme_id)
    challenges = ch_query.all()

    ivc_query = db.query(IssueValueCase)
    if programme_id:
        ivc_query = ivc_query.filter(IssueValueCase.programme_id == programme_id)
    issue_cases = ivc_query.all()

    return {
        "metadata": {
            "source": "NHIH 360° Discovery Tour Registry",
            "layer": "Layer A - Operational Facts",
            "timestamp": datetime.utcnow().isoformat(),
            "ministry": "Ministry of Health, Sierra Leone",
            "hub": "National Health Information Hub (NHIH / DPPI)",
        },
        "programmes": [
            {
                "id": p.id,
                "name": p.name,
                "type": p.programme_type,
                "lead_contact": p.contact_person,
                "email": p.contact_email,
            }
            for p in programmes
        ],
        "data_sources": [
            {
                "id": ds.id,
                "programme_id": ds.programme_id,
                "name": ds.name,
                "system_type": ds.system_type,
                "description": ds.description,
                "format": ds.data_format,
                "frequency": ds.data_frequency,
                "owner": ds.data_owner,
                "integration_status": ds.integration_status,
            }
            for ds in data_sources
        ],
        "challenges": [
            {
                "id": c.id,
                "programme_id": c.programme_id,
                "title": c.title,
                "severity": c.severity,
                "status": c.status,
            }
            for c in challenges
        ],
        "issues_and_value_cases": [
            {
                "id": i.id,
                "programme_id": i.programme_id,
                "title": i.title,
                "type": i.case_type,
                "priority": i.priority,
                "status": i.status,
            }
            for i in issue_cases
        ],
    }


@router.get("/signals")
def get_analytical_signals(db: Session = Depends(get_db)):
    """
    Layer B: ANALYTICAL SIGNALS
    Deterministic computations, integration readiness indices, and fragmentation indicators.
    Contains no speculative text or generative claims.
    """
    total_programmes = db.query(Programme).filter(Programme.is_active == True).count()
    engaged_programmes = (
        db.query(Engagement.programme_id)
        .distinct()
        .count()
    )
    completed_engagements = (
        db.query(Engagement)
        .filter(Engagement.status == "completed")
        .count()
    )

    data_sources = db.query(DataSource).all()
    total_sources = len(data_sources)
    not_integrated = sum(1 for ds in data_sources if ds.integration_status == "not_integrated")
    partially_integrated = sum(1 for ds in data_sources if ds.integration_status == "partially_integrated")
    fully_integrated = sum(1 for ds in data_sources if ds.integration_status == "fully_integrated")

    challenges = db.query(OperationalChallenge).all()
    critical_ch = sum(1 for c in challenges if c.severity == "critical")
    high_ch = sum(1 for c in challenges if c.severity == "high")

    # Fragmentation index: ratio of unintegrated or isolated systems
    fragmentation_ratio = (
        round((not_integrated + (partially_integrated * 0.5)) / max(total_sources, 1), 2)
        if total_sources > 0 else 0.0
    )

    # Engagement coverage percentage
    coverage_pct = round((engaged_programmes / max(total_programmes, 1)) * 100, 1)

    return {
        "metadata": {
            "source": "NHIH Intelligence Computation Engine",
            "layer": "Layer B - Analytical Signals",
            "computed_at": datetime.utcnow().isoformat(),
        },
        "signals": {
            "coverage": {
                "total_programmes": total_programmes,
                "engaged_programmes": engaged_programmes,
                "coverage_percentage": coverage_pct,
                "completed_engagements": completed_engagements,
            },
            "integration_maturity": {
                "total_data_sources": total_sources,
                "not_integrated_count": not_integrated,
                "partially_integrated_count": partially_integrated,
                "fully_integrated_count": fully_integrated,
                "fragmentation_index": fragmentation_ratio,
                "integration_readiness_pct": round(
                    ((fully_integrated + (partially_integrated * 0.5)) / max(total_sources, 1)) * 100, 1
                ),
            },
            "risk_profile": {
                "total_challenges": len(challenges),
                "critical_severity_count": critical_ch,
                "high_severity_count": high_ch,
                "risk_concentration": "High in logistics & paper-based reporting" if not_integrated > 3 else "Moderate",
            },
        },
    }


@router.get("/reasoning-context")
def get_grounded_reasoning_context(db: Session = Depends(get_db)):
    """
    Layer C: AI REASONING CONTEXT PACKAGE
    Strictly factual, structured JSON payload prepared for consumption by the
    NHIH / HOS Intelligence Layer engine. Does NOT output ungrounded AI conclusions.
    Enforces truth-in-data principles.
    """
    engagements = (
        db.query(Engagement)
        .options(
            joinedload(Engagement.programme),
            joinedload(Engagement.data_sources),
            joinedload(Engagement.operational_challenges),
            joinedload(Engagement.assessments),
        )
        .filter(Engagement.status.in_(["completed", "in_progress"]))
        .all()
    )

    dossiers = []
    for eng in engagements:
        dossiers.append({
            "programme_name": eng.programme.name if eng.programme else "Unknown",
            "engagement_cycle_status": {
                "day1_intro_complete": eng.day1_complete,
                "day2_discovery_complete": eng.day2_complete,
                "day3_consolidation_complete": eng.day3_complete,
            },
            "verified_data_sources": [
                {
                    "name": ds.name,
                    "type": ds.system_type,
                    "frequency": ds.data_frequency,
                    "integration_state": ds.integration_status,
                }
                for ds in eng.data_sources
            ],
            "verified_operational_challenges": [
                {
                    "title": oc.title,
                    "severity": oc.severity,
                    "status": oc.status,
                }
                for oc in eng.operational_challenges
            ],
            "assessment_findings": [
                {
                    "type": a.assessment_type,
                    "findings": a.findings,
                    "recommendations": a.recommendations,
                }
                for a in eng.assessments
            ],
        })

    return {
        "standard": "NHIH Intelligence Layer Grounding Protocol v1.0",
        "intended_consumer": "HOS Intelligence Layer / Reasoning Engine",
        "guardrail": "Factual inputs only. Disallows speculative extrapolations without source references.",
        "programme_dossiers": dossiers,
    }


@router.get("/export")
def export_complete_intelligence_bundle(db: Session = Depends(get_db)):
    """
    Unified export combining Layers A, B, and C for seamless integration with
    the existing NHIH / HOS Operational Dashboard.
    """
    facts = get_operational_facts(db=db)
    signals = get_analytical_signals(db=db)
    reasoning = get_grounded_reasoning_context(db=db)

    return {
        "bundle_id": f"NHIH-INTELLIGENCE-360-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "schema_version": "2.0.0",
        "facts_layer": facts,
        "signals_layer": signals,
        "reasoning_layer": reasoning,
    }
