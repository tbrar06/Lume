"""
Script to demonstrate LinkedIn scraping output.
This file mirrors the test cases but prints detailed output instead of running assertions.
"""

import asyncio
import sys
import os
import logging
import time
from pprint import pprint

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.job_scraper_agent import JobScraperAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def demonstrate_url_construction():
    """Show LinkedIn URL construction examples."""
    print("\n=== URL Construction Examples ===")
    scraper = JobScraperAgent()
    
    # Example 1: Software Engineer in San Francisco
    url1 = scraper._construct_linkedin_url(
        search_terms=["software engineer", "python"],
        location="San Francisco",
        remote_only=True
    )
    print("\nURL for Software Engineer in San Francisco (Remote):")
    print(url1)
    
    # Example 2: Data Scientist in New York
    url2 = scraper._construct_linkedin_url(
        search_terms=["data scientist"],
        location="New York",
        remote_only=False
    )
    print("\nURL for Data Scientist in New York:")
    print(url2)

async def demonstrate_linkedin_scraping():
    """Show actual LinkedIn scraping results."""
    print("\n=== LinkedIn Scraping Results ===")
    scraper = JobScraperAgent()
    
    try:
        print("\nSearching for Python Developer positions in Toronto...")
        jobs = await scraper.scrape_linkedin(
            search_terms=["Python Developer"],
            location="Toronto",
            remote_only=False,
            max_results=5
        )
        
        print(f"\nFound {len(jobs)} jobs:")
        for i, job in enumerate(jobs, 1):
            print(f"\nJob {i}:")
            print(f"Title: {job.title}")
            print(f"Company: {job.company}")
            print(f"Location: {job.location}")
            print(f"URL: {job.url}")
            print(f"Job ID: {job.job_id}")
            print("-" * 50)
            
    except Exception as e:
        print(f"\nError during LinkedIn scraping: {e}")
        print(f"Exception details: {str(e)}")

async def demonstrate_different_searches():
    """Show results with different search parameters."""
    print("\n=== Different Search Parameters ===")
    scraper = JobScraperAgent()
    
    # Software Engineer in Toronto
    print("\nSearching for Software Engineer positions in Toronto...")
    jobs1 = await scraper.scrape_linkedin(
        search_terms=["Software Engineer"],
        location="Toronto",
        remote_only=False,
        max_results=3
    )
    
    print(f"\nFound {len(jobs1)} Software Engineering jobs:")
    for i, job in enumerate(jobs1, 1):
        print(f"\nJob {i}:")
        print(f"Title: {job.title}")
        print(f"Company: {job.company}")
        print(f"Location: {job.location}")
        print("-" * 50)
    
    # Python Developer in Vancouver
    print("\nSearching for Python Developer positions in Vancouver...")
    jobs2 = await scraper.scrape_linkedin(
        search_terms=["Python Developer"],
        location="Vancouver",
        remote_only=False,
        max_results=3
    )
    
    print(f"\nFound {len(jobs2)} jobs in Vancouver:")
    for i, job in enumerate(jobs2, 1):
        print(f"\nJob {i}:")
        print(f"Title: {job.title}")
        print(f"Company: {job.company}")
        print(f"Location: {job.location}")
        print("-" * 50)

async def demonstrate_rate_limiting():
    """Show rate limiting behavior."""
    print("\n=== Rate Limiting Demonstration ===")
    scraper = JobScraperAgent()
    
    start_time = time.time()
    
    print("\nMaking first request...")
    jobs1 = await scraper.scrape_linkedin(
        search_terms=["Python Developer"],
        location="Toronto",
        remote_only=False,
        max_results=2
    )
    
    mid_time = time.time()
    print(f"First request completed in {mid_time - start_time:.2f} seconds")
    print(f"Found {len(jobs1)} jobs")
    
    print("\nMaking second request...")
    jobs2 = await scraper.scrape_linkedin(
        search_terms=["Software Engineer"],
        location="Toronto",
        remote_only=False,
        max_results=2
    )
    
    end_time = time.time()
    print(f"Second request completed in {end_time - mid_time:.2f} seconds")
    print(f"Found {len(jobs2)} jobs")
    print(f"\nTotal time between requests: {end_time - start_time:.2f} seconds")

async def main():
    """Run all demonstrations."""
    print("\n=== LinkedIn Scraping Demonstration ===")
    print("Starting demonstrations...")
    
    await demonstrate_url_construction()
    await demonstrate_linkedin_scraping()
    await demonstrate_different_searches()
    await demonstrate_rate_limiting()
    
    print("\nDemonstrations completed.")

if __name__ == "__main__":
    asyncio.run(main())