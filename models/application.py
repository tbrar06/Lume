"""
Models for job applications
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobApplication(BaseModel):
    """Model for job applications"""
    job_id: str
    user_id: str
    status: str  # applied, interviewed, rejected, accepted
    applied_date: datetime
    company: str
    title: str
    job_url: str  # URL to the job posting
    notes: Optional[str] = None 