from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class JobListing(BaseModel):
    """
    Model for job listings scraped from various sources
    Basic fields are required, additional fields are optional
    """
    title: str
    company: str
    location: str
    url: str
    source: str  # linkedin
    job_id: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    salary_range: Optional[str] = None
    posted_date: Optional[datetime] = None
    is_remote: Optional[bool] = None
    num_applicants: Optional[str] = None

class JobScraperRequest(BaseModel):
    source: str
    search_terms: List[str]
    location: Optional[str] = None
    remote_only: bool = False
    page: int = 1

class JobScraperResponse(BaseModel):
    success: bool
    message: str
    jobs: List[JobListing] = []

class JobRecommendationRequest(BaseModel):
    user_id: str
    num_recommendations: int = 5

class JobRecommendationResponse(BaseModel):
    success: bool
    message: str
    recommendations: List[JobListing] = []
    match_scores: Optional[List[float]] = None 