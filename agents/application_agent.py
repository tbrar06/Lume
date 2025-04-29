"""
Application Agent for the Lume application.
This agent handles job application tracking and metrics.
"""

from uagents import Agent, Context
from models.application import JobApplication
from utils.storage import storage
import logging
from datetime import datetime, timedelta
from typing import List, Dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ApplicationAgent:
    """
    Application Agent class that manages job applications.
    
    Responsibilities:
    1. Tracks job applications
    2. Calculates application metrics
    3. Manages application status
    """
    
    def __init__(self):
        """Initialize the application agent."""
        self.agent = Agent(
            name="application_agent",
            port=8002,
            endpoint=["http://0.0.0.0:8002/submit"],
            seed="application_agent_34957937"
        )
        
        self.setup_handlers()
    
    def setup_handlers(self):
        """Set up message handlers for application operations."""
        @self.agent.on_event("startup")
        async def initialize(ctx: Context):
            """Initialize the application agent on startup."""
            logger.info("Application Agent initialized")
    
    async def track_application(self, job_id: str, user_id: str, company: str, title: str, job_url: str) -> bool:
        """Track a new job application."""
        try:
            # Create application with datetime converted to ISO format string
            application_data = {
                "job_id": job_id,
                "user_id": user_id,
                "status": "applied",
                "applied_date": datetime.now().isoformat(),
                "company": company,
                "title": title,
                "job_url": job_url,
                "notes": None
            }
            
            # Store application
            storage.save_item("applications", f"{user_id}_{job_id}", application_data)
            return True
            
        except Exception as e:
            logger.error(f"Error tracking application: {e}")
            return False
    
    async def get_user_applications(self, user_id: str) -> List[Dict]:
        """Get all applications for a user."""
        try:
            all_applications = storage.get_all_items("applications")
            if not isinstance(all_applications, dict):
                logger.error(f"Invalid applications data type: {type(all_applications)}")
                return []
            
            user_applications = []
            for app_id, app_data in all_applications.items():
                try:
                    if app_data.get("user_id") == user_id:
                        # Create a copy of the application data to avoid modifying the original
                        app_copy = app_data.copy()
                        
                        # Safely convert applied_date if it exists and is a string
                        if "applied_date" in app_copy and isinstance(app_copy["applied_date"], str):
                            try:
                                app_copy["applied_date"] = datetime.fromisoformat(app_copy["applied_date"])
                            except ValueError as e:
                                logger.warning(f"Invalid date format for application {app_id}: {e}")
                                # If date conversion fails, keep the original string
                                pass
                        
                        user_applications.append(app_copy)
                except Exception as e:
                    logger.error(f"Error processing application {app_id}: {e}")
                    continue
            
            return user_applications
        except Exception as e:
            logger.error(f"Error getting user applications: {e}")
            return []
    
    async def get_weekly_metrics(self, user_id: str) -> Dict:
        """Get weekly application metrics for a user."""
        try:
            applications = await self.get_user_applications(user_id)
            now = datetime.now()
            week_start = now - timedelta(days=now.weekday())
            
            weekly_applications = [
                app for app in applications
                if isinstance(app.get("applied_date"), datetime) and app["applied_date"] >= week_start
            ]
            
            return {
                "total_applications": len(applications),
                "weekly_applications": len(weekly_applications),
                "success_rate": 0.0  # TODO: Implement success rate calculation
            }
            
        except Exception as e:
            logger.error(f"Error getting weekly metrics: {e}")
            return {
                "total_applications": 0,
                "weekly_applications": 0,
                "success_rate": 0.0
            }
    
    def run(self):
        """Run the application agent."""
        try:
            logger.info("Starting application agent...")
            self.agent.run()
        except Exception as e:
            logger.error(f"Error running application agent: {e}")
            raise 