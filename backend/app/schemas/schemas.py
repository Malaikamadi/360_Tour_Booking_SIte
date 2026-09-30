"""
NHIH 360° Discovery Tour - Pydantic Schemas
Request/response validation schemas for all API endpoints.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, time
from enum import Enum


# ---------------------------------------------------------------------------
# Enums for API
# ---------------------------------------------------------------------------
class UserRoleEnum(str, Enum):
    PUBLIC = "public"
    PROGRAMME_USER = "programme_user"
    NHIH_STAFF = "nhih_staff"
    NHIH_ADMIN = "nhih_admin"


class ProgrammeTypeEnum(str, Enum):
    DIRECTORATE = "directorate"
    PROGRAMME = "programme"
    UNIT = "unit"
    AGENCY = "agency"


class BookingStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    RESCHEDULED = "rescheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EngagementStatusEnum(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EngagementTypeEnum(str, Enum):
    FULL_360 = "full_360"
    DATA_DISCOVERY = "data_discovery"
    FOLLOW_UP = "follow_up"
    TWG_SESSION = "twg_session"


class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SeverityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    phone: Optional[str] = None
    programme_id: Optional[int] = None


# ---------------------------------------------------------------------------
# User Schemas
# ---------------------------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    programme_id: Optional[int] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    role: UserRoleEnum = UserRoleEnum.PUBLIC


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRoleEnum] = None
    programme_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Programme Schemas
# ---------------------------------------------------------------------------
class ProgrammeBase(BaseModel):
    name: str
    programme_type: ProgrammeTypeEnum = ProgrammeTypeEnum.PROGRAMME
    description: Optional[str] = None
    parent_id: Optional[int] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


class ProgrammeCreate(ProgrammeBase):
    pass


class ProgrammeUpdate(BaseModel):
    name: Optional[str] = None
    programme_type: Optional[ProgrammeTypeEnum] = None
    description: Optional[str] = None
    parent_id: Optional[int] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    is_active: Optional[bool] = None


class ProgrammeResponse(ProgrammeBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProgrammeListResponse(BaseModel):
    id: int
    name: str
    programme_type: str
    is_active: bool

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Stakeholder Group Schemas
# ---------------------------------------------------------------------------
class StakeholderGroupBase(BaseModel):
    name: str
    description: Optional[str] = None


class StakeholderGroupCreate(StakeholderGroupBase):
    pass


class StakeholderGroupResponse(StakeholderGroupBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Space Schemas
# ---------------------------------------------------------------------------
class SpaceBase(BaseModel):
    name: str
    location: Optional[str] = None
    capacity: Optional[int] = None


class SpaceCreate(SpaceBase):
    pass


class SpaceUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    is_active: Optional[bool] = None


class SpaceResponse(SpaceBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Booking Schemas
# ---------------------------------------------------------------------------
class BookingBase(BaseModel):
    programme_id: int
    engagement_type: EngagementTypeEnum = EngagementTypeEnum.FULL_360
    requested_date: date
    start_time: time
    end_time: time
    location: Optional[str] = None
    contact_person: str
    contact_email: EmailStr
    contact_phone: Optional[str] = None
    participant_count: int = Field(default=1, ge=1)
    space_id: Optional[int] = None
    additional_requirements: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    requested_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    location: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    participant_count: Optional[int] = None
    space_id: Optional[int] = None
    additional_requirements: Optional[str] = None
    status: Optional[BookingStatusEnum] = None


class BookingResponse(BookingBase):
    id: int
    booking_reference: str
    engagement_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    programme_name: Optional[str] = None

    class Config:
        from_attributes = True


class BookingListResponse(BaseModel):
    id: int
    booking_reference: str
    programme_id: int
    programme_name: Optional[str] = None
    engagement_type: str
    requested_date: date
    start_time: time
    end_time: time
    status: str
    contact_person: str
    participant_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class AvailabilityRequest(BaseModel):
    requested_date: date
    start_time: time
    end_time: time
    space_id: Optional[int] = None


class AvailabilityResponse(BaseModel):
    available: bool
    requested_date: date
    start_time: time
    end_time: time
    conflicts: List[dict] = []
    alternative_slots: List[dict] = []


# ---------------------------------------------------------------------------
# Engagement Schemas
# ---------------------------------------------------------------------------
class EngagementBase(BaseModel):
    programme_id: int
    stakeholder_group_id: Optional[int] = None
    engagement_type: EngagementTypeEnum = EngagementTypeEnum.FULL_360


class EngagementCreate(EngagementBase):
    pass


class EngagementUpdate(BaseModel):
    status: Optional[EngagementStatusEnum] = None
    day1_complete: Optional[bool] = None
    day2_complete: Optional[bool] = None
    day3_complete: Optional[bool] = None
    day1_notes: Optional[str] = None
    day2_notes: Optional[str] = None
    day3_notes: Optional[str] = None
    summary: Optional[str] = None


class EngagementResponse(EngagementBase):
    id: int
    status: str
    day1_complete: bool
    day2_complete: bool
    day3_complete: bool
    day1_notes: Optional[str] = None
    day2_notes: Optional[str] = None
    day3_notes: Optional[str] = None
    summary: Optional[str] = None
    programme_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Assessment Schemas
# ---------------------------------------------------------------------------
class AssessmentCreate(BaseModel):
    engagement_id: int
    assessment_type: Optional[str] = None
    findings: Optional[str] = None
    recommendations: Optional[str] = None
    assessed_by: Optional[str] = None
    assessed_date: Optional[date] = None


class AssessmentResponse(BaseModel):
    id: int
    engagement_id: int
    assessment_type: Optional[str] = None
    findings: Optional[str] = None
    recommendations: Optional[str] = None
    assessed_by: Optional[str] = None
    assessed_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# DataSource Schemas
# ---------------------------------------------------------------------------
class DataSourceCreate(BaseModel):
    engagement_id: Optional[int] = None
    programme_id: int
    name: str
    system_type: Optional[str] = None
    description: Optional[str] = None
    data_format: Optional[str] = None
    data_frequency: Optional[str] = None
    data_owner: Optional[str] = None
    integration_status: Optional[str] = "not_integrated"


class DataSourceResponse(BaseModel):
    id: int
    engagement_id: Optional[int] = None
    programme_id: int
    name: str
    system_type: Optional[str] = None
    description: Optional[str] = None
    data_format: Optional[str] = None
    data_frequency: Optional[str] = None
    data_owner: Optional[str] = None
    integration_status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Operational Challenge Schemas
# ---------------------------------------------------------------------------
class OperationalChallengeCreate(BaseModel):
    engagement_id: Optional[int] = None
    programme_id: int
    title: str
    description: Optional[str] = None
    severity: SeverityEnum = SeverityEnum.MEDIUM


class OperationalChallengeResponse(BaseModel):
    id: int
    engagement_id: Optional[int] = None
    programme_id: int
    title: str
    description: Optional[str] = None
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Issue / Value Case Schemas
# ---------------------------------------------------------------------------
class IssueValueCaseCreate(BaseModel):
    engagement_id: Optional[int] = None
    programme_id: int
    title: str
    description: Optional[str] = None
    case_type: str = "issue"
    priority: PriorityEnum = PriorityEnum.MEDIUM


class IssueValueCaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[str] = None
    resolution: Optional[str] = None


class IssueValueCaseResponse(BaseModel):
    id: int
    engagement_id: Optional[int] = None
    programme_id: int
    title: str
    description: Optional[str] = None
    case_type: str
    priority: str
    status: str
    resolution: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Decision Maker Schemas
# ---------------------------------------------------------------------------
class DecisionMakerCreate(BaseModel):
    programme_id: int
    name: str
    role: Optional[str] = None
    data_used: Optional[str] = None
    decisions_supported: Optional[str] = None


class DecisionMakerResponse(BaseModel):
    id: int
    programme_id: int
    name: str
    role: Optional[str] = None
    data_used: Optional[str] = None
    decisions_supported: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Integration Requirement Schemas
# ---------------------------------------------------------------------------
class IntegrationRequirementCreate(BaseModel):
    engagement_id: Optional[int] = None
    programme_id: int
    source_system: str
    target_system: str
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.MEDIUM


class IntegrationRequirementResponse(BaseModel):
    id: int
    engagement_id: Optional[int] = None
    programme_id: int
    source_system: str
    target_system: str
    description: Optional[str] = None
    priority: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Intervention Schemas
# ---------------------------------------------------------------------------
class InterventionCreate(BaseModel):
    engagement_id: int
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[date] = None


class InterventionResponse(BaseModel):
    id: int
    engagement_id: int
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    status: str
    due_date: Optional[date] = None
    completed_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Outcome Schemas
# ---------------------------------------------------------------------------
class OutcomeCreate(BaseModel):
    engagement_id: int
    intervention_id: Optional[int] = None
    description: str
    impact: Optional[str] = None


class OutcomeResponse(BaseModel):
    id: int
    engagement_id: int
    intervention_id: Optional[int] = None
    description: str
    impact: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Dashboard Schemas
# ---------------------------------------------------------------------------
class DashboardStats(BaseModel):
    upcoming_engagements: int = 0
    pending_requests: int = 0
    completed_engagements: int = 0
    in_progress_engagements: int = 0
    stakeholder_groups_engaged: int = 0
    outstanding_issues: int = 0
    total_programmes: int = 0
    total_data_sources: int = 0


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------
class PaginatedResponse(BaseModel):
    items: List = []
    total: int = 0
    page: int = 1
    per_page: int = 20
    pages: int = 0
