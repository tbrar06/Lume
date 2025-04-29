from typing import List, Optional, Dict
from pydantic import BaseModel, EmailStr

class SkillCategory(BaseModel):
    programming_languages: List[str] = []
    frameworks_and_tools: List[str] = []
    certifications: List[str] = []
    technologies: List[str] = []

class UserProfile(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    skills: SkillCategory
    experience_years: float
    preferred_roles: List[str]
    preferred_locations: List[str]
    weekly_application_goal: int
    preferred_industries: List[str]
    remote_preference: bool = True
    
class UserProfileRequest(BaseModel):
    action: str  # "create", "update", "get"
    profile: Optional[UserProfile] = None
    user_id: Optional[str] = None

class UserProfileResponse(BaseModel):
    success: bool
    message: str
    profile: Optional[UserProfile] = None 