from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserProfile(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    skills: List[str]
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