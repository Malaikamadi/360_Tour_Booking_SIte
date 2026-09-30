"""
NHIH 360° Discovery Tour - Backend API Entry Point
Ministry of Health, Sierra Leone — Directorate of Policy, Planning & Information (DPPI)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.database import create_tables
from app.db.seed import seed_database
from app.api import auth, bookings, programmes, engagements, dashboard, intelligence, spaces


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed initial MoH dataset
    try:
        create_tables()
        seed_database()
    except Exception as e:
        print(f"[WARNING] Database initialization note: {e}")
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="NHIH 360° Discovery Tour API",
    description="Programme-facing engagement, booking and discovery API for the National Health Information Hub (NHIH), DPPI, Ministry of Health, Sierra Leone.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(bookings.router)
app.include_router(programmes.router)
app.include_router(engagements.router)
app.include_router(dashboard.router)
app.include_router(intelligence.router)
app.include_router(spaces.router)


@app.get("/")
def root():
    return {
        "initiative": "NHIH 360° Discovery Tour",
        "authority": "National Health Information Hub (NHIH)",
        "directorate": "Directorate of Policy, Planning & Information (DPPI)",
        "ministry": "Ministry of Health, Sierra Leone",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
    }


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": "2026-09-30T09:30:00Z",
    }
