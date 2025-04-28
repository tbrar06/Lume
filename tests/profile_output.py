"""
Script to demonstrate ProfileAgent functionality.
This file mirrors the test cases but prints detailed output instead of running assertions.
"""

import asyncio
import sys
import os
import logging
import json
from pprint import pprint

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.profile_agent import ProfileAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_sample_profile():
    """Create a sample profile for demonstration."""
    return {
        "user_id": "demo123",
        "name": "Demo User",
        "email": "demo@example.com",
        "skills": ["Python", "Machine Learning", "Data Science"],
        "experience_years": 5.0,
        "preferred_roles": ["Software Engineer", "Data Scientist"],
        "preferred_locations": ["San Francisco", "Remote"],
        "weekly_application_goal": 10,
        "preferred_industries": ["Technology", "Finance"],
        "remote_preference": True
    }

async def demonstrate_profile_creation():
    """Show profile creation process."""
    print("\n=== Profile Creation Demonstration ===")
    agent = ProfileAgent()
    profile = create_sample_profile()
    
    print("\nCreating profile with data:")
    pprint(profile)
    
    response = await agent.create_profile(profile)
    print("\nResponse from creation:")
    pprint(response.dict())
    
    # Show the saved file contents
    if os.path.exists("profiles.json"):
        print("\nSaved profile data (profiles.json):")
        with open("profiles.json", "r") as f:
            pprint(json.load(f))

async def demonstrate_profile_retrieval():
    """Show profile retrieval process."""
    print("\n=== Profile Retrieval Demonstration ===")
    agent = ProfileAgent()
    
    # Try to get existing profile
    print("\nRetrieving profile for user 'demo123':")
    response = await agent.get_profile("demo123")
    print("\nResponse from retrieval:")
    pprint(response.dict())
    
    # Try to get non-existent profile
    print("\nTrying to retrieve non-existent profile:")
    response = await agent.get_profile("nonexistent")
    print("\nResponse from failed retrieval:")
    pprint(response.dict())

async def demonstrate_profile_updates():
    """Show profile update process."""
    print("\n=== Profile Update Demonstration ===")
    agent = ProfileAgent()
    
    # Update existing profile
    updated_data = create_sample_profile()
    updated_data["name"] = "Updated Demo User"
    updated_data["skills"].append("AWS")
    
    print("\nUpdating profile with new data:")
    pprint(updated_data)
    
    response = await agent.update_profile(updated_data)
    print("\nResponse from update:")
    pprint(response.dict())
    
    # Show updated file contents
    if os.path.exists("profiles.json"):
        print("\nUpdated profile data (profiles.json):")
        with open("profiles.json", "r") as f:
            pprint(json.load(f))

async def demonstrate_profile_validation():
    """Show profile validation process."""
    print("\n=== Profile Validation Demonstration ===")
    agent = ProfileAgent()
    
    # Test with invalid profile
    invalid_profile = {
        "user_id": "invalid123",
        "name": "Invalid User"
        # Missing required fields
    }
    
    print("\nTrying to create invalid profile:")
    pprint(invalid_profile)
    
    response = await agent.create_profile(invalid_profile)
    print("\nResponse from invalid profile creation:")
    pprint(response.dict())
    
    # Test with valid profile
    valid_profile = {
        "user_id": "valid123",
        "name": "Valid User",
        "email": "valid@example.com",
        "skills": ["Python"],
        "experience_years": 2.0,
        "preferred_roles": ["Software Engineer"],
        "preferred_locations": ["Remote"],
        "weekly_application_goal": 5,
        "preferred_industries": ["Technology"],
        "remote_preference": True
    }
    
    print("\nTrying to create valid profile:")
    pprint(valid_profile)
    
    response = await agent.create_profile(valid_profile)
    print("\nResponse from valid profile creation:")
    pprint(response.dict())

async def demonstrate_profile_persistence():
    """Show profile data persistence."""
    print("\n=== Profile Persistence Demonstration ===")
    
    # Create first agent and profile
    print("\nCreating profile with first agent instance:")
    agent1 = ProfileAgent()
    profile = create_sample_profile()
    await agent1.create_profile(profile)
    
    # Create second agent instance
    print("\nCreating new agent instance and loading profiles:")
    agent2 = ProfileAgent()
    
    # Try to retrieve profile with second instance
    print("\nRetrieving profile with new instance:")
    response = await agent2.get_profile(profile["user_id"])
    print("\nResponse from retrieval:")
    pprint(response.dict())

async def main():
    """Run all demonstrations."""
    print("\n=== ProfileAgent Functionality Demonstration ===")
    print("Starting demonstrations...")
    
    # Clean start
    if os.path.exists("profiles.json"):
        os.remove("profiles.json")
    
    await demonstrate_profile_creation()
    await demonstrate_profile_retrieval()
    await demonstrate_profile_updates()
    await demonstrate_profile_validation()
    await demonstrate_profile_persistence()
    
    print("\nDemonstrations completed.")

if __name__ == "__main__":
    asyncio.run(main()) 