import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from api.scheduler import JobScheduler

@pytest.mark.asyncio
async def test_scheduler_invokes_real_agents():
    scheduler = JobScheduler()
    user_id = 'test123'  # This should match a test profile in your system
    # Optionally, set up a test profile here if needed
    jobs = await scheduler._get_daily_jobs_for_user(user_id)
    # The test passes if no exception is raised and jobs is a list
    assert isinstance(jobs, list)
    # Optionally, check that jobs_data is updated
    assert user_id in scheduler.jobs_data
    assert isinstance(scheduler.jobs_data[user_id]['jobs'], list)
    assert isinstance(scheduler.jobs_data[user_id]['timestamp'], str)
    # Optionally, print jobs for debug
    print(f"Jobs returned for {user_id}: {jobs}") 