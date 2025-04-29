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
from pydantic import ValidationError
from utils.storage import storage

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
            storage.save_item("profiles", profile.user_id, profile.dict())
            
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
            if not user_id:
                return AgentResponse(
                    status="error",
                    message="Profile ID is required"
                )
            
            # Validate updated data
            updated_profile = UserProfile(**profile_data)
            
            # Update profile
            storage.save_item("profiles", user_id, updated_profile.dict())
            
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
            profile_data = storage.get_item("profiles", user_id)
            if not profile_data:
                return AgentResponse(
                    status="error",
                    message="Profile not found"
                )
            
            return AgentResponse(
                status="success",
                message="Profile retrieved successfully",
                profile=profile_data
            )
            
        except Exception as e:
            logger.error(f"Error retrieving profile: {e}")
            return AgentResponse(
                status="error",
                message=str(e)
            )
    
    async def get_all_profiles(self) -> list:
        """Retrieve all user profiles."""
        try:
            profiles_data = storage.get_all_items("profiles")
            if not isinstance(profiles_data, dict):
                logger.error(f"Invalid profiles data type: {type(profiles_data)}")
                return []
            
            profiles = []
            for user_id, profile_data in profiles_data.items():
                try:
                    if isinstance(profile_data, dict):
                        profile = UserProfile(**profile_data)
                        profiles.append(profile)
                    else:
                        logger.warning(f"Skipping invalid profile data for user {user_id}")
                except ValidationError as e:
                    logger.error(f"Error validating profile for user {user_id}: {e}")
                    continue
                except Exception as e:
                    logger.error(f"Error processing profile for user {user_id}: {e}")
                    continue
            
            return profiles
        except Exception as e:
            logger.error(f"Error retrieving all profiles: {e}")
            return []
    
    def load_profiles(self):
        """Load profiles from storage."""
        try:
            storage.load_collection("profiles")
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