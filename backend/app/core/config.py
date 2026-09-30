"""
NHIH 360° Discovery Tour - Application Configuration
"""
from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "NHIH 360° Discovery Tour"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "sqlite:///./nhih_360_tour.db"

    # Security
    SECRET_KEY: str = "change-this-to-a-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # CORS
    CORS_ORIGINS: str = '["http://localhost:3000","http://127.0.0.1:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    # Booking Rules
    MIN_BOOKING_LEAD_DAYS: int = 2
    MAX_BOOKING_ADVANCE_DAYS: int = 90
    DEFAULT_ENGAGEMENT_DURATION_DAYS: int = 3
    BUSINESS_HOUR_START: int = 8
    BUSINESS_HOUR_END: int = 17

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
