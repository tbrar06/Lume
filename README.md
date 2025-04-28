# Lume - AI-Powered Job Search Assistant

Lume is an intelligent job search assistant powered by Fetch.ai's uAgent framework. It helps users manage their job search process through automated job sourcing, personalized recommendations, and goal tracking.

## Features (POC)

- User profile management
- Automated job scraping from major job boards
- Job matching and recommendations
- Goal setting and tracking
- Daily engagement reminders

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Run the agents:
```bash
python main.py
```

## Architecture

The system consists of several autonomous agents:

- **Profile Agent**: Manages user profiles and preferences
- **Job Scraper Agent**: Collects job listings from various sources
- **Recommendation Agent**: Matches jobs with user profiles
- **Engagement Agent**: Manages user goals and reminders

## Development Status

This is a proof of concept implementation focusing on core functionality. 