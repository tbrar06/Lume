"""
Test file for ProfileAgent functionality.
Tests profile creation, updates, and retrieval operations.
"""

import pytest
import asyncio
import sys
import os
import logging
import json
from typing import Dict

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.profile_agent import ProfileAgent
from models.user_profile import UserProfile
from models.messages import AgentResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture
def profile_agent():
    """Create a ProfileAgent instance for testing."""
    agent = ProfileAgent()
    # Clean up any existing profiles.json to start fresh
    if os.path.exists("profiles.json"):
        os.remove("profiles.json")
    return agent

@pytest.fixture
def sample_profile() -> Dict:
    """Create a sample profile for testing."""
    return {
        "user_id": "test123",
        "name": "Test User",
        "email": "test@example.com",
        "skills": {
            "programming_languages": ["Python", "JavaScript"],
            "frameworks_and_tools": ["React", "Django"],
            "certifications": ["AWS Certified Developer"],
            "technologies": ["Machine Learning", "AWS"]
        },
        "experience_years": 5.0,
        "preferred_roles": ["Software Engineer", "Data Scientist"],
        "preferred_locations": ["San Francisco", "Remote"],
        "weekly_application_goal": 10,
        "preferred_industries": ["Technology", "Finance"],
        "remote_preference": True
    }

@pytest.mark.asyncio
async def test_create_profile(profile_agent, sample_profile):
    """Test profile creation."""
    logger.info("Testing profile creation...")
    
    # Create profile
    response = await profile_agent.create_profile(sample_profile)
    
    # Verify response
    assert response.status == "success", "Profile creation should succeed"
    assert response.message == "Profile created successfully"
    assert response.profile is not None
    
    # Verify profile data
    created_profile = response.profile
    assert created_profile["user_id"] == sample_profile["user_id"]
    assert created_profile["name"] == sample_profile["name"]
    assert created_profile["email"] == sample_profile["email"]
    assert created_profile["skills"] == sample_profile["skills"]
    
    # Verify profile was saved
    assert os.path.exists("profiles.json"), "Profile should be saved to file"
    
    logger.info("Profile creation test passed")

@pytest.mark.asyncio
async def test_get_profile(profile_agent, sample_profile):
    """Test profile retrieval."""
    logger.info("Testing profile retrieval...")
    
    # First create a profile
    await profile_agent.create_profile(sample_profile)
    
    # Then retrieve it
    response = await profile_agent.get_profile(sample_profile["user_id"])
    
    # Verify response
    assert response.status == "success", "Profile retrieval should succeed"
    assert response.message == "Profile retrieved successfully"
    assert response.profile is not None
    
    # Verify retrieved data matches original
    retrieved_profile = response.profile
    assert retrieved_profile["user_id"] == sample_profile["user_id"]
    assert retrieved_profile["name"] == sample_profile["name"]
    assert retrieved_profile["email"] == sample_profile["email"]
    assert retrieved_profile["skills"] == sample_profile["skills"]
    
    logger.info("Profile retrieval test passed")

@pytest.mark.asyncio
async def test_update_profile(profile_agent, sample_profile):
    """Test profile updates."""
    logger.info("Testing profile updates...")
    
    # First create a profile
    await profile_agent.create_profile(sample_profile)
    
    # Update profile data
    updated_data = sample_profile.copy()
    updated_data["name"] = "Updated Name"
    updated_data["skills"]["technologies"].append("AWS")
    
    # Perform update
    response = await profile_agent.update_profile(updated_data)
    
    # Verify response
    assert response.status == "success", "Profile update should succeed"
    assert response.message == "Profile updated successfully"
    assert response.profile is not None
    
    # Verify updated data
    updated_profile = response.profile
    assert updated_profile["name"] == "Updated Name"
    assert "AWS" in updated_profile["skills"]["technologies"]
    
    # Verify other fields remained unchanged
    assert updated_profile["user_id"] == sample_profile["user_id"]
    assert updated_profile["email"] == sample_profile["email"]
    
    logger.info("Profile update test passed")

@pytest.mark.asyncio
async def test_profile_validation(profile_agent):
    """Test profile validation."""
    logger.info("Testing profile validation...")
    
    # Test with missing required fields
    invalid_profile = {
        "user_id": "test123",
        "name": "Test User"
        # Missing required fields
    }
    
    response = await profile_agent.create_profile(invalid_profile)
    assert response.status == "error", "Should reject invalid profile"
    assert response.message == "Invalid profile data"
    
    # Test with all required fields
    valid_profile = {
        "user_id": "test123",
        "name": "Test User",
        "email": "test@example.com",
        "skills": {
            "programming_languages": ["Python"],
            "frameworks_and_tools": ["Django"],
            "certifications": [],
            "technologies": ["AWS"]
        },
        "experience_years": 2.0,
        "preferred_roles": ["Software Engineer"],
        "preferred_locations": ["Remote"],
        "weekly_application_goal": 5,
        "preferred_industries": ["Technology"],
        "remote_preference": True
    }
    
    response = await profile_agent.create_profile(valid_profile)
    assert response.status == "success", "Should accept valid profile"
    
    logger.info("Profile validation test passed")

@pytest.mark.asyncio
async def test_profile_persistence(profile_agent, sample_profile):
    """Test profile data persistence."""
    logger.info("Testing profile persistence...")
    
    # Create a profile
    await profile_agent.create_profile(sample_profile)
    
    # Create a new agent instance to test loading from file
    new_agent = ProfileAgent()
    
    # Try to retrieve the profile with new instance
    response = await new_agent.get_profile(sample_profile["user_id"])
    
    # Verify profile was loaded
    assert response.status == "success", "Should load profile from file"
    assert response.profile["user_id"] == sample_profile["user_id"]
    assert response.profile["name"] == sample_profile["name"]
    
    logger.info("Profile persistence test passed")

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 