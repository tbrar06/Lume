"""
Job scheduler for Lume
Handles scheduling and execution of daily job scraping tasks
"""

import logging
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from models.user_profile import UserProfile
from models.job import JobListing
from agents.job_scraper_agent import JobScraperAgent
from agents.profile_agent import ProfileAgent

logger = logging.getLogger(__name__)

class JobScheduler:
    def __init__(self):
        self.profile_agent = ProfileAgent()
        self.job_scraper_agent = JobScraperAgent()
        self.jobs_data: Dict[str, List[JobListing]] = {}
        self._running = False
        self._task = None

    async def start(self):
        """Start the scheduler"""
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._run_scheduler())

    async def stop(self):
        """Stop the scheduler"""
        if not self._running:
            return
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass

    async def _run_scheduler(self):
        """Main scheduler loop"""
        while self._running:
            try:
                await self._daily_job_scraping()
                # Wait until next day
                now = datetime.now()
                next_run = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
                await asyncio.sleep((next_run - now).total_seconds())
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in scheduler loop: {e}")
                await asyncio.sleep(60)  # Wait a minute before retrying

    async def _daily_job_scraping(self):
        """Perform daily job scraping for all users"""
        try:
            # Get all user profiles
            profiles = await self.profile_agent.get_all_profiles()
            for profile in profiles:
                try:
                    jobs = await self._get_daily_jobs_for_user(profile)
                    self.jobs_data[profile.user_id] = jobs
                except Exception as e:
                    logger.error(f"Error scraping jobs for user {profile.user_id}: {e}")
        except Exception as e:
            logger.error(f"Error in daily job scraping: {e}")

    async def _get_daily_jobs_for_user(self, profile: UserProfile) -> List[JobListing]:
        """Get daily job recommendations for a user"""
        try:
            # Use the job scraper agent to get jobs based on user preferences
            jobs = await self.job_scraper_agent.scrape_jobs(
                source="linkedin",
                search_terms=profile.preferred_roles,
                location=profile.preferred_locations[0] if profile.preferred_locations else None,
                remote_only=profile.remote_preference == "remote_only",
                max_results=10  # Default to 10 jobs per user
            )
            return jobs
        except Exception as e:
            logger.error(f"Error getting jobs for user {profile.user_id}: {e}")
            return []

    def get_user_jobs(self, user_id: str) -> List[JobListing]:
        """Get the latest scraped jobs for a user"""
        return self.jobs_data.get(user_id, []) 