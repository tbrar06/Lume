"""
Test file for JobScraperAgent's LinkedIn scraping functionality.
This file tests the core scraping logic with actual LinkedIn requests.
"""

import pytest
import asyncio
import sys
import os
import logging
import time

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.job_scraper_agent import JobScraperAgent
from models.job import JobListing

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def scraper():
    """Create a JobScraperAgent instance for testing."""
    return JobScraperAgent()

@pytest.mark.asyncio
async def test_construct_linkedin_url(scraper):
    """Test LinkedIn URL construction."""
    # Test basic URL construction
    url = scraper._construct_linkedin_url(
        search_terms=["software engineer", "python"],
        location="San Francisco",
        remote_only=True
    )
    assert "linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search" in url
    assert "keywords=software+engineer+python" in url
    assert "location=San+Francisco" in url
    assert "start=0" in url

    # Test with different parameters
    url = scraper._construct_linkedin_url(
        search_terms=["data scientist"],
        location="New York",
        remote_only=False
    )
    assert "linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search" in url
    assert "keywords=data+scientist" in url
    assert "location=New+York" in url
    assert "start=0" in url

@pytest.mark.asyncio
async def test_scrape_linkedin_actual_request(scraper):
    """Test actual LinkedIn scraping with real requests."""
    logger.info("Testing actual LinkedIn scraping...")
    
    try:
        jobs = await scraper.scrape_linkedin(
            search_terms=["Python Developer"],
            location="Toronto", 
            remote_only=False,
            max_results=5
        )
        
        logger.info(f"Found {len(jobs)} jobs")
        for i, job in enumerate(jobs, 1):
            logger.info(f"\nJob {i}:")
            logger.info(f"Title: {job.title}")
            logger.info(f"Company: {job.company}")
            logger.info(f"Location: {job.location}")
            logger.info(f"URL: {job.url}")
        
        assert len(jobs) > 0, "Should find at least one job"
        assert all(isinstance(job, JobListing) for job in jobs), "All results should be JobListing objects"
        assert all(job.title for job in jobs), "All jobs should have a title"
        assert all(job.company for job in jobs), "All jobs should have a company"
        assert all(job.location for job in jobs), "All jobs should have a location"
        assert all(job.url.startswith("https://www.linkedin.com/jobs/view/") for job in jobs), "All jobs should have a LinkedIn URL"
        
    except Exception as e:
        logger.error(f"Error during LinkedIn scraping test: {e}")
        logger.error(f"Exception details: {str(e)}")
        raise

@pytest.mark.asyncio
async def test_scrape_linkedin_different_parameters(scraper):
    """Test LinkedIn scraping with different search parameters."""
    logger.info("Testing different search terms...")
    jobs = await scraper.scrape_linkedin(
        search_terms=["Software Engineer"],
        location="Toronto",
        remote_only=False,
        max_results=3
    )
    
    logger.info(f"Found {len(jobs)} software engineering jobs")
    assert len(jobs) > 0, "Should find at least one software engineering job"
    
    logger.info("Testing different location...")
    jobs = await scraper.scrape_linkedin(
        search_terms=["Python Developer"],
        location="Vancouver",
        remote_only=False,
        max_results=3
    )
    
    logger.info(f"Found {len(jobs)} jobs in Vancouver")
    assert len(jobs) > 0, "Should find at least one job in Vancouver"

@pytest.mark.asyncio
async def test_scrape_linkedin_rate_limiting(scraper):
    """Test rate limiting in LinkedIn scraping."""
    logger.info("Testing rate limiting...")
    
    # Record start time
    start_time = time.time()
    
    # Make two requests 
    jobs1 = await scraper.scrape_linkedin(
        search_terms=["Python Developer"],
        location="Toronto",
        remote_only=False,
        max_results=2
    )
    
    jobs2 = await scraper.scrape_linkedin(
        search_terms=["Software Engineer"],
        location="Toronto",
        remote_only=False,
        max_results=2
    )
    
    # Calculate time difference
    end_time = time.time()
    time_diff = end_time - start_time
    
    logger.info(f"First request found {len(jobs1)} jobs")
    logger.info(f"Second request found {len(jobs2)} jobs")
    logger.info(f"Time between requests: {time_diff:.2f} seconds")
    
    # Verify rate limiting (should be at least 1 second between requests)
    assert time_diff >= 1.0, "Rate limiting not working properly"

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 