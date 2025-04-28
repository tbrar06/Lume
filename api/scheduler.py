"""
Scheduler module for daily job scraping and recommendations.
This module handles the orchestration of daily job scraping based on user profiles.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
import math
from typing import List, Dict
from datetime import datetime

from agents.profile_agent import ProfileAgent
from agents.job_scraper_agent import JobScraperAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class JobScheduler:
    """Handles scheduling and execution of daily job scraping tasks"""
    
    def __init__(self):
        """Initialize the scheduler and agents."""
        self.scheduler = AsyncIOScheduler()
        self.profile_agent = ProfileAgent()
        self.job_scraper_agent = JobScraperAgent()
        self.jobs_data = {}  # Store scraped jobs by user_id
        
    async def _get_daily_jobs_for_user(self, user_id: str) -> List[Dict]:
        """Get daily job recommendations for a specific user"""
        try:
            # Get user profile
            profile_response = await self.profile_agent.get_profile(user_id)
            if profile_response.status == "error":
                logger.error(f"Failed to get profile for user {user_id}: {profile_response.message}")
                return []
            
            profile = profile_response.profile
            
            # Calculate daily job target
            weekly_goal = profile.get("weekly_application_goal", 0)
            daily_goal = math.ceil(weekly_goal / 7)
            
            if daily_goal <= 0:
                logger.info(f"User {user_id} has no weekly application goal set")
                return []
            
            # Prepare search parameters
            search_terms = profile.get("preferred_roles", []) + profile.get("skills", [])
            location = profile.get("preferred_locations", [None])[0]
            remote_only = profile.get("remote_preference", False)
            
            # Scrape jobs
            jobs = await self.job_scraper_agent.scrape_linkedin(
                search_terms=search_terms,
                location=location,
                remote_only=remote_only,
                max_results=daily_goal
            )
            
            # Store jobs
            self.jobs_data[user_id] = {
                "timestamp": datetime.now().isoformat(),
                "jobs": jobs
            }
            
            logger.info(f"Successfully scraped {len(jobs)} jobs for user {user_id}")
            return jobs
            
        except Exception as e:
            logger.error(f"Error getting jobs for user {user_id}: {e}")
            return []
    
    async def _daily_job_scraping(self):
        """Execute daily job scraping for all users"""
        try:
            # TODO Should get this from your database
            # For now, use a hardcoded list of user IDs
            user_ids = ["demo123", "test123"]  

            for user_id in user_ids:
                await self._get_daily_jobs_for_user(user_id)
                
        except Exception as e:
            logger.error(f"Error in daily job scraping: {e}")
    
    def start(self):
        """Start the scheduler"""
        # Schedule daily job scraping at 6 AM
        self.scheduler.add_job(
            self._daily_job_scraping,
            CronTrigger(hour=6, minute=0),
            id="daily_job_scraping",
            name="Daily job scraping task",
            replace_existing=True
        )
        
        # Run initial job scraping
        self.scheduler.add_job(
            self._daily_job_scraping,
            'date',  # Run once immediately
            id="initial_job_scraping",
            name="Initial job scraping task"
        )
        
        self.scheduler.start()
        logger.info("Job scheduler started")
    
    def stop(self):
        """Stop the scheduler"""
        self.scheduler.shutdown()
        logger.info("Job scheduler stopped")
    
    def get_user_jobs(self, user_id: str) -> Dict:
        """Get the latest scraped jobs for a user"""
        return self.jobs_data.get(user_id, {"timestamp": None, "jobs": []}) 