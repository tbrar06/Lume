"""
Job Scraper Agent for the Lume application.
This agent handles job listing retrieval from LinkedIn

The agent:
1. Receives job search requests
2. Scrapes job listings from specified sources
3. Processes and normalizes job data
4. Returns structured job listings
"""

from uagents import Agent, Context
from models.messages import JobScraperMessage, AgentResponse
from models.job import JobListing
import logging
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import time
import ssl

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a custom SSL context that doesn't verify certificates
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

class JobScraperAgent:
    """
    Job Scraper Agent class that handles job listing retrieval
    
    Responsibilities:
    1. Scrapes job listings from LinkedIn
    2. Normalizes job data into a consistent format
    3. Handles rate limiting and error cases
    4. Manages scraping sessions
    """
    
    def __init__(self):
        """Initialize the job scraper agent"""
        self.agent = Agent(
            name="job_scraper",
            port=8001,
            endpoint=["http://0.0.0.0:8001/submit"],
            seed="job_scraper_agent_34957937"
        )
        
        self.setup_handlers()
        
        # Initialize scraping settings
        self.rate_limit = 1  # seconds between requests
        self.last_request_time = 0
    
    def setup_handlers(self):
        """
        Set up message handlers for job scraping operations
        
        Handlers:
        1. Startup handler - Initializes the agent
        2. Job scraper message handler - Processes scraping requests
        """
        @self.agent.on_event("startup")
        async def initialize(ctx: Context):
            """Initialize the job scraper agent on startup."""
            logger.info("Job Scraper Agent initialized")
        
        @self.agent.on_message(model=JobScraperMessage)
        async def handle_scraper_message(ctx: Context, sender: str, msg: JobScraperMessage):
            """
            Handle job scraping requests
            
            Processes:
            - Job search requests
            - Scraping from specified sources (currently only LinkedIn)
            - Response formatting
            """
            try:
                logger.info(f"Received job scraping request from {sender}")
                
                jobs = await self.scrape_jobs(
                    source=msg.source,
                    search_terms=msg.search_terms,
                    location=msg.location,
                    remote_only=msg.remote_only,
                    max_results=msg.max_results
                )
                
                response = AgentResponse(
                    status="success",
                    message=f"Found {len(jobs)} jobs",
                    jobs=jobs
                )
                await ctx.send(sender, response)
                
            except Exception as e:
                logger.error(f"Error handling job scraping request: {e}")
                await ctx.send(sender, AgentResponse(
                    status="error",
                    message=str(e)
                ))
    
    async def scrape_jobs(self, source: str, search_terms: list, location: str,
                         remote_only: bool, max_results: int) -> list:
        """
        Scrape jobs from the specified source
        
        Args:
            source: Job board source (Linkedin)
            search_terms: List of search terms
            location: Location to search in
            remote_only: Whether to only return remote jobs
            max_results: Maximum number of results to return
            
        Returns:
            List of JobListing objects
        """
        try:
            # Enforce rate limiting
            current_time = time.time()
            if current_time - self.last_request_time < self.rate_limit:
                await asyncio.sleep(self.rate_limit)
            self.last_request_time = time.time()
            
            # Scrape based on source
            if source.lower() == "linkedin":
                return await self.scrape_linkedin(
                    search_terms,
                    location,
                    remote_only,
                    max_results
                )
            else:
                raise ValueError(f"Unsupported source: {source}")
                
        except Exception as e:
            logger.error(f"Error scraping jobs: {e}")
            return []
    
    async def scrape_linkedin(self, search_terms: list, location: str,
                            remote_only: bool, max_results: int) -> list:
        """
        Scrape jobs from LinkedIn
        
        Args:
            search_terms: List of search terms
            location: Location to search in
            remote_only: Whether to only return remote jobs
            max_results: Maximum number of results to return
            
        Returns:
            List of JobListing objects
        """
        try:
            jobs = []
            connector = aiohttp.TCPConnector(ssl=ssl_context)
            async with aiohttp.ClientSession(connector=connector) as session:
                search_url = self._construct_linkedin_url(
                    search_terms,
                    location,
                    remote_only
                )
                
                logger.info(f"Making request to URL: {search_url}")
                
                async with session.get(search_url) as response:
                    logger.info(f"Response status: {response.status}")
                    
                    if response.status == 200:
                        html = await response.text()
                        
                        soup = BeautifulSoup(html, 'html.parser')
                        
                        job_elements = soup.find_all('li')
                        
                        # Process each job element
                        for job in job_elements[:max_results]:
                            try:
                                base_card = job.find('div', {'class': 'base-card'})
                                if not base_card:
                                    logger.debug("No base-card found in li element")
                                    continue
                                
                                job_id = base_card.get('data-entity-urn', '').split(':')[-1]
                                if not job_id:
                                    logger.debug("No job ID found")
                                    continue
                                
                                # Extract job details
                                title_elem = base_card.find('h3', {'class': 'base-search-card__title'})
                                company_elem = base_card.find('h4', {'class': 'base-search-card__subtitle'})
                                location_elem = base_card.find('span', {'class': 'job-search-card__location'})
                                
                                if not all([title_elem, company_elem, location_elem]):
                                    logger.debug("Missing required job elements")
                                    continue
                                
                                # Create job listing with only required fields
                                job = JobListing(
                                    title=title_elem.text.strip(),
                                    company=company_elem.text.strip(),
                                    location=location_elem.text.strip(),
                                    url=f"https://www.linkedin.com/jobs/view/{job_id}",
                                    source="linkedin",
                                    job_id=job_id
                                )
                                
                                jobs.append(job)
                                logger.info(f"Successfully parsed job: {job.title} at {job.company}")
                                
                            except Exception as e:
                                logger.warning(f"Failed to parse job element: {e}")
                                continue
                    else:
                        logger.error(f"LinkedIn returned status code: {response.status}")
                        return []
            
            logger.info(f"Total jobs found and parsed: {len(jobs)}")
            return jobs
            
        except Exception as e:
            logger.error(f"Error scraping LinkedIn: {e}")
            logger.error(f"Exception details: {str(e)}")
            return []
    
    def _construct_linkedin_url(self, search_terms: list, location: str,
                              remote_only: bool) -> str:
        """
        Construct LinkedIn search URL.
        
        Args:
            search_terms: List of search terms
            location: Location to search in
            remote_only: Whether to only return remote jobs
            
        Returns:
            Constructed URL string
        """
        # Join search terms 
        keywords = " ".join(search_terms).replace(" ", "+")
        location = location.replace(" ", "+")
        
        url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={keywords}&location={location}&start=0"
        logger.info(f"Constructed URL: {url}")
        return url
    
    def _parse_linkedin_job(self, element) -> JobListing:
        """
        Parse a LinkedIn job listing element
        
        Args:
            element: BeautifulSoup element containing job data
            
        Returns:
            JobListing object or None if parsing fails
        """
        try:
            base_card = element.find('div', {'class': 'base-card'})
            if not base_card:
                logger.warning("No base-card div found in element")
                return None
                
            # Extract job ID from data-entity-urn
            job_id = base_card.get('data-entity-urn', '').split(':')[-1]
            if not job_id:
                logger.warning("No job ID found in data-entity-urn")
                return None
                
            # Extract job details with fallbacks
            title_elem = base_card.find('h3', {'class': 'base-search-card__title'})
            company_elem = base_card.find('h4', {'class': 'base-search-card__subtitle'})
            location_elem = base_card.find('span', {'class': 'job-search-card__location'})
            
            if not title_elem:
                logger.warning("No title element found")
                return None
            if not company_elem:
                logger.warning("No company element found")
                return None
            if not location_elem:
                logger.warning("No location element found")
                return None
                
            title = title_elem.text.strip()
            company = company_elem.text.strip()
            location = location_elem.text.strip()
            url = f"https://www.linkedin.com/jobs/view/{job_id}"
            
            logger.info(f"Successfully parsed job: {title} at {company}")
            
            return JobListing(
                title=title,
                company=company,
                location=location,
                url=url,
                source="linkedin"
            )
        except Exception as e:
            logger.error(f"Error parsing LinkedIn job: {e}")
            return None
    
    def run(self):
        """Run the job scraper agent."""
        try:
            logger.info("Starting job scraper agent...")
            self.agent.run()
        except Exception as e:
            logger.error(f"Error running job scraper agent: {e}")
            raise