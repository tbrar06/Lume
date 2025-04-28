"""
Profile Agent for the Lume application.
This agent handles all user profile-related operations including:
- Creating new user profiles
- Updating existing profiles
- Retrieving profile information
- Managing profile data storage
"""

from uagents import Agent, Context
from models.messages import ProfileMessage, AgentResponse
from models.user_profile import UserProfile
import logging
import json
import os
from pydantic import ValidationError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ProfileAgent:
    """
    Profile Agent class that manages user profiles.
    
    Responsibilities:
    1. Handles profile creation and updates
    2. Stores and retrieves profile data
    3. Validates profile information
    4. Manages profile persistence
    """
    
    def __init__(self):
        """Initialize the profile agent."""
        self.agent = Agent(
            name="profile_agent",
            port=8000,
            endpoint=["http://0.0.0.0:8000/submit"],
            seed="profile_agent_34529759739"
        )
        
        self.setup_handlers()
        self.profiles = {}
        self.load_profiles()

    def setup_handlers(self):
        """Set up message handlers for profile operations."""
        @self.agent.on_event("startup")
        async def initialize(ctx: Context):
            """Initialize the profile agent on startup."""
            logger.info("Profile Agent initialized")
        
        @self.agent.on_message(model=ProfileMessage)
        async def handle_profile_message(ctx: Context, sender: str, msg: ProfileMessage):
            try:
                logger.info(f"Received profile message from {sender}")
                
                if msg.action == "create":
                    response = await self.create_profile(msg.profile)
                elif msg.action == "update":
                    response = await self.update_profile(msg.profile)
                elif msg.action == "get":
                    response = await self.get_profile(msg.profile["user_id"])
                else:
                    response = AgentResponse(
                        status="error",
                        message=f"Invalid action: {msg.action}"
                    )
                
                await ctx.send(sender, response)
                
            except Exception as e:
                logger.error(f"Error handling profile message: {e}")
                await ctx.send(sender, AgentResponse(
                    status="error",
                    message=str(e)
                ))
    
    async def create_profile(self, profile_data: dict) -> AgentResponse:
        """Create a new user profile."""
        try:
            # Create and validate profile using Pydantic
            profile = UserProfile(**profile_data)
            
            # Store profile
            self.profiles[profile.user_id] = profile
            self.save_profiles()
            
            return AgentResponse(
                status="success",
                message="Profile created successfully",
                profile=profile.dict()
            )
            
        except ValidationError as e:
            logger.error(f"Profile validation error: {e}")
            return AgentResponse(
                status="error",
                message="Invalid profile data"
            )
        except Exception as e:
            logger.error(f"Error creating profile: {e}")
            return AgentResponse(
                status="error",
                message=str(e)
            )
    
    async def update_profile(self, profile_data: dict) -> AgentResponse:
        """Update an existing user profile."""
        try:
            user_id = profile_data.get("user_id")
            if not user_id or user_id not in self.profiles:
                return AgentResponse(
                    status="error",
                    message="Profile not found"
                )
            
            # Validate updated data
            updated_profile = UserProfile(**profile_data)
            
            # Update profile
            self.profiles[user_id] = updated_profile
            self.save_profiles()
            
            return AgentResponse(
                status="success",
                message="Profile updated successfully",
                profile=updated_profile.dict()
            )
            
        except ValidationError as e:
            logger.error(f"Profile validation error: {e}")
            return AgentResponse(
                status="error",
                message="Invalid profile data"
            )
        except Exception as e:
            logger.error(f"Error updating profile: {e}")
            return AgentResponse(
                status="error",
                message=str(e)
            )
    
    async def get_profile(self, user_id: str) -> AgentResponse:
        """Retrieve a user profile."""
        try:
            if user_id not in self.profiles:
                return AgentResponse(
                    status="error",
                    message="Profile not found"
                )
            
            return AgentResponse(
                status="success",
                message="Profile retrieved successfully",
                profile=self.profiles[user_id].dict()
            )
            
        except Exception as e:
            logger.error(f"Error retrieving profile: {e}")
            return AgentResponse(
                status="error",
                message=str(e)
            )
    
    def save_profiles(self):
        """Save profiles to persistent storage."""
        try:
            with open("profiles.json", "w") as f:
                json.dump(
                    {k: v.dict() for k, v in self.profiles.items()},
                    f,
                    indent=2
                )
        except Exception as e:
            logger.error(f"Error saving profiles: {e}")
    
    def load_profiles(self):
        """Load profiles from persistent storage."""
        try:
            if os.path.exists("profiles.json"):
                with open("profiles.json", "r") as f:
                    data = json.load(f)
                    self.profiles = {
                        k: UserProfile(**v) for k, v in data.items()
                    }
        except Exception as e:
            logger.error(f"Error loading profiles: {e}")
    
    def run(self):
        """Run the profile agent."""
        try:
            logger.info("Starting profile agent...")
            self.agent.run()
        except Exception as e:
            logger.error(f"Error running profile agent: {e}")
            raise