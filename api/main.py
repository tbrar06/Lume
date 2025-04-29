"""
FastAPI application for the Lume backend
This serves as the central orchestrator for all agents and provides the API endpoints
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import logging
import uvicorn
import asyncio

# Import our agents and scheduler
from agents.profile_agent import ProfileAgent
from agents.job_scraper_agent import JobScraperAgent
from api.scheduler import JobScheduler
from agents.application_agent import ApplicationAgent
from models.user_profile import SkillCategory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Lume API",
    description="Backend API for the Lume job application assistant",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents and scheduler
profile_agent = ProfileAgent()
job_scraper_agent = JobScraperAgent()
job_scheduler = JobScheduler()
application_agent = ApplicationAgent()

@app.on_event("startup")
async def startup_event():
    # Start the job scheduler
    await job_scheduler.start()
    # Run initial job scraping
    await job_scheduler._daily_job_scraping()

@app.on_event("shutdown")
async def shutdown_event():
    await job_scheduler.stop()
    # Stop the job scraper agent
    job_scraper_agent.shutdown()
  
class UserProfileCreate(BaseModel):
    user_id: str
    name: str
    email: str
    skills: SkillCategory
    experience_years: float
    preferred_roles: List[str]
    preferred_locations: List[str]
    weekly_application_goal: int
    preferred_industries: List[str]
    remote_preference: bool

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    skills: Optional[SkillCategory] = None
    experience_years: Optional[float] = None
    preferred_roles: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    weekly_application_goal: Optional[int] = None
    preferred_industries: Optional[List[str]] = None
    remote_preference: Optional[bool] = None

class JobSearchParams(BaseModel):
    search_terms: List[str]
    location: Optional[str] = None
    remote_only: Optional[bool] = False
    max_results: Optional[int] = 10

class ApplicationCreate(BaseModel):
    job_id: str
    user_id: str
    company: str
    title: str
    job_url: str

@app.post("/profiles")
async def create_profile(profile: UserProfileCreate):
    """Create a new user profile"""
    try:
        response = await profile_agent.create_profile(profile.dict())
        if response.status == "error":
            raise HTTPException(status_code=400, detail=response.message)
        return response
    except Exception as e:
        logger.error(f"Error creating profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/profiles/{user_id}")
async def get_profile(user_id: str):
    """Get a user profile by ID"""
    try:
        response = await profile_agent.get_profile(user_id)
        if response.status == "error":
            raise HTTPException(status_code=404, detail=response.message)
        return {"profile": response.profile}
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/profiles/{user_id}")
async def update_profile(user_id: str, profile_update: UserProfileUpdate):
    """Update a user profile"""
    try:
        # Get existing profile
        existing_profile = await profile_agent.get_profile(user_id)
        if existing_profile.status == "error":
            raise HTTPException(status_code=404, detail=existing_profile.message)
        
        # Update with new values
        updated_profile = existing_profile.profile.copy()
        for field, value in profile_update.dict(exclude_unset=True).items():
            updated_profile[field] = value
        
        # Save updated profile
        response = await profile_agent.update_profile(updated_profile)
        if response.status == "error":
            raise HTTPException(status_code=400, detail=response.message)
        return response
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs/{user_id}")
async def get_user_jobs(user_id: str):
    """Get the latest scraped jobs for a user"""
    try:
        jobs = job_scheduler.get_user_jobs(user_id)
        if not jobs:
            raise HTTPException(status_code=404, detail="No jobs found for user")
        return {"jobs": jobs}
    except Exception as e:
        logger.error(f"Error getting jobs for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/jobs/search")
async def search_jobs(params: JobSearchParams):
    """Search for jobs based on parameters"""
    try:
        response = await job_scraper_agent.scrape_linkedin(
            search_terms=params.search_terms,
            location=params.location,
            remote_only=params.remote_only,
            max_results=params.max_results
        )
        return response
    except Exception as e:
        logger.error(f"Error searching jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/applications")
async def create_application(application: ApplicationCreate):
    """Track a new job application"""
    try:
        success = await application_agent.track_application(
            job_id=application.job_id,
            user_id=application.user_id,
            company=application.company,
            title=application.title,
            job_url=application.job_url
        )
        if not success:
            raise HTTPException(status_code=400, detail="Failed to track application")
        return {"status": "success", "message": "Application tracked successfully"}
    except Exception as e:
        logger.error(f"Error tracking application: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/applications")
async def get_applications():
    """Get all applications for the current user"""
    try:
        # For now, use a test user ID. In production, this should come from authentication
        user_id = "test123"
        applications = await application_agent.get_user_applications(user_id)
        return {"applications": applications}
    except Exception as e:
        logger.error(f"Error getting applications: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics/{user_id}")
async def get_user_metrics(user_id: str):
    """Get application metrics for a user"""
    try:
        metrics = await application_agent.get_weekly_metrics(user_id)
        return metrics
    except Exception as e:
        logger.error(f"Error getting metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 