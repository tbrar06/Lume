from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class BaseMessage(BaseModel):
    message_type: str
    content: dict

class ProfileMessage(BaseModel):
    action: str  # "create" or "get"
    profile: dict

class JobScraperMessage(BaseModel):
    source: str
    search_terms: List[str]
    location: Optional[str] = None
    remote_only: Optional[bool] = False
    page: Optional[int] = 1

class RecommendationMessage(BaseModel):
    user_id: str
    num_recommendations: Optional[int] = 5

class AgentResponse(BaseModel):
    status: str
    message: str
    profile: Optional[Dict[str, Any]] = None
    jobs: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[Dict[str, Any]]] = None 