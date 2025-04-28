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

# Import our agents and scheduler
from agents.profile_agent import ProfileAgent
from agents.job_scraper_agent import JobScraperAgent
from api.scheduler import JobScheduler

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

@app.on_event("startup")
async def startup_event():
    job_scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    job_scheduler.stop()

class UserProfileCreate(BaseModel):
    user_id: str
    name: str
    email: str
    skills: List[str]
    experience_years: float
    preferred_roles: List[str]
    preferred_locations: List[str]
    weekly_application_goal: int
    preferred_industries: List[str]
    remote_preference: bool

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    skills: Optional[List[str]] = None
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
        return response
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
        jobs_data = job_scheduler.get_user_jobs(user_id)
        if not jobs_data["jobs"]:
            raise HTTPException(status_code=404, detail="No jobs found for user")
        return jobs_data
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 