from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from src.database import engine, Base
from src.config import settings
from src.routes import auth, entries, habits, reminders, activities, stats

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SCT Tracker API",
    description="API for SCT Tracker application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "healthy"})

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(entries.router, prefix="/api/entries", tags=["entries"])
app.include_router(habits.router, prefix="/api/habits", tags=["habits"])
app.include_router(reminders.router, prefix="/api/reminders", tags=["reminders"])
app.include_router(activities.router, prefix="/api/activities", tags=["activities"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

@app.get("/")
async def root():
    return {"message": "SCT Tracker API", "version": "1.0.0"}

