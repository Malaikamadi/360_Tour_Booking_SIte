"""
NHIH 360° Discovery Tour - Database Models
All 14 entities for the engagement and booking system.
"""
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Date, Time,
    ForeignKey, Enum, UniqueConstraint, CheckConstraint, Index,
    func,
)
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------
class UserRole(str, enum.Enum):
    PUBLIC = "public"
    PROGRAMME_USER = "programme_user"
    NHIH_STAFF = "nhih_staff"
    NHIH_ADMIN = "nhih_admin"


class ProgrammeType(str, enum.Enum):
    DIRECTORATE = "directorate"
    PROGRAMME = "programme"
    UNIT = "unit"
    AGENCY = "agency"


class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EngagementStatus(str, enum.Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EngagementType(str, enum.Enum):
    FULL_360 = "full_360"
    DATA_DISCOVERY = "data_discovery"
    FOLLOW_UP = "follow_up"
    TWG_SESSION = "twg_session"


class Priority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Severity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IntegrationStatus(str, enum.Enum):
    NOT_INTEGRATED = "not_integrated"
    PARTIALLY_INTEGRATED = "partially_integrated"
    FULLY_INTEGRATED = "fully_integrated"
    PLANNED = "planned"


class IssueType(str, enum.Enum):
    ISSUE = "issue"
    VALUE_CASE = "value_case"


class InterventionStatus(str, enum.Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"


class OutcomeStatus(str, enum.Enum):
    PENDING = "pending"
    ACHIEVED = "achieved"
    PARTIALLY_ACHIEVED = "partially_achieved"
    NOT_ACHIEVED = "not_achieved"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.PUBLIC.value)
    phone = Column(String(50))
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    programme = relationship("Programme", back_populates="users")


class Programme(Base):
    __tablename__ = "programmes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    programme_type = Column(String(50), nullable=False, default=ProgrammeType.PROGRAMME.value)
    description = Column(Text)
    parent_id = Column(Integer, ForeignKey("programmes.id"), nullable=True)
    contact_person = Column(String(255))
    contact_email = Column(String(255))
    contact_phone = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    parent = relationship("Programme", remote_side="Programme.id", backref="children")
    users = relationship("User", back_populates="programme")
    engagements = relationship("Engagement", back_populates="programme")
    bookings = relationship("Booking", back_populates="programme")
    data_sources = relationship("DataSource", back_populates="programme")
    operational_challenges = relationship("OperationalChallenge", back_populates="programme")
    issue_value_cases = relationship("IssueValueCase", back_populates="programme")
    decision_makers = relationship("DecisionMaker", back_populates="programme")
    integration_requirements = relationship("IntegrationRequirement", back_populates="programme")


class StakeholderGroup(Base):
    __tablename__ = "stakeholder_groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagements = relationship("Engagement", back_populates="stakeholder_group")


class Space(Base):
    __tablename__ = "spaces"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    capacity = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bookings = relationship("Booking", back_populates="space")


class Engagement(Base):
    __tablename__ = "engagements"

    id = Column(Integer, primary_key=True, index=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    stakeholder_group_id = Column(Integer, ForeignKey("stakeholder_groups.id"), nullable=True)
    engagement_type = Column(String(50), nullable=False, default=EngagementType.FULL_360.value)
    status = Column(String(50), nullable=False, default=EngagementStatus.PLANNED.value)
    day1_complete = Column(Boolean, default=False)
    day2_complete = Column(Boolean, default=False)
    day3_complete = Column(Boolean, default=False)
    day1_notes = Column(Text)
    day2_notes = Column(Text)
    day3_notes = Column(Text)
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    programme = relationship("Programme", back_populates="engagements")
    stakeholder_group = relationship("StakeholderGroup", back_populates="engagements")
    bookings = relationship("Booking", back_populates="engagement")
    assessments = relationship("Assessment", back_populates="engagement")
    data_sources = relationship("DataSource", back_populates="engagement")
    operational_challenges = relationship("OperationalChallenge", back_populates="engagement")
    issue_value_cases = relationship("IssueValueCase", back_populates="engagement")
    integration_requirements = relationship("IntegrationRequirement", back_populates="engagement")
    interventions = relationship("Intervention", back_populates="engagement")
    outcomes = relationship("Outcome", back_populates="engagement")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String(20), unique=True, nullable=False, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    space_id = Column(Integer, ForeignKey("spaces.id"), nullable=True)
    engagement_type = Column(String(50), nullable=False, default=EngagementType.FULL_360.value)
    requested_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    location = Column(String(255))
    contact_person = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50))
    participant_count = Column(Integer, default=1)
    status = Column(String(50), nullable=False, default=BookingStatus.PENDING.value)
    additional_requirements = Column(Text)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="bookings")
    programme = relationship("Programme", back_populates="bookings")
    space = relationship("Space", back_populates="bookings")

    # Indexes for conflict detection
    __table_args__ = (
        Index("ix_booking_date_time", "requested_date", "start_time", "end_time"),
        Index("ix_booking_space_date", "space_id", "requested_date"),
    )


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=False)
    assessment_type = Column(String(100))
    findings = Column(Text)
    recommendations = Column(Text)
    assessed_by = Column(String(255))
    assessed_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="assessments")


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    name = Column(String(255), nullable=False)
    system_type = Column(String(100))  # e.g., DHIS2, mSupply, Excel, Paper
    description = Column(Text)
    data_format = Column(String(100))
    data_frequency = Column(String(100))  # e.g., daily, weekly, monthly
    data_owner = Column(String(255))
    integration_status = Column(
        String(50), default=IntegrationStatus.NOT_INTEGRATED.value
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="data_sources")
    programme = relationship("Programme", back_populates="data_sources")


class OperationalChallenge(Base):
    __tablename__ = "operational_challenges"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(50), default=Severity.MEDIUM.value)
    status = Column(String(50), default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="operational_challenges")
    programme = relationship("Programme", back_populates="operational_challenges")


class IssueValueCase(Base):
    __tablename__ = "issue_value_cases"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    case_type = Column(String(50), nullable=False, default=IssueType.ISSUE.value)
    priority = Column(String(50), default=Priority.MEDIUM.value)
    status = Column(String(50), default="open")
    resolution = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="issue_value_cases")
    programme = relationship("Programme", back_populates="issue_value_cases")


class DecisionMaker(Base):
    __tablename__ = "decision_makers"

    id = Column(Integer, primary_key=True, index=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(255))
    data_used = Column(Text)
    decisions_supported = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    programme = relationship("Programme", back_populates="decision_makers")


class IntegrationRequirement(Base):
    __tablename__ = "integration_requirements"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=True)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    source_system = Column(String(255), nullable=False)
    target_system = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(String(50), default=Priority.MEDIUM.value)
    status = Column(String(50), default="identified")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="integration_requirements")
    programme = relationship("Programme", back_populates="integration_requirements")


class Intervention(Base):
    __tablename__ = "interventions"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    assigned_to = Column(String(255))
    status = Column(String(50), default=InterventionStatus.PLANNED.value)
    due_date = Column(Date)
    completed_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="interventions")
    outcomes = relationship("Outcome", back_populates="intervention")


class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True, index=True)
    engagement_id = Column(Integer, ForeignKey("engagements.id"), nullable=False)
    intervention_id = Column(Integer, ForeignKey("interventions.id"), nullable=True)
    description = Column(Text, nullable=False)
    impact = Column(Text)
    status = Column(String(50), default=OutcomeStatus.PENDING.value)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    engagement = relationship("Engagement", back_populates="outcomes")
    intervention = relationship("Intervention", back_populates="outcomes")
