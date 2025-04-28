export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  experience_years: number;
  preferred_roles: string[];
  preferred_locations: string[];
  weekly_application_goal: number;
  preferred_industries: string[];
  remote_preference: 'remote' | 'hybrid' | 'onsite';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  posted_date: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  applied_date: string;
  last_updated: string;
  notes?: string;
  interview_dates?: string[];
  offer_details?: {
    salary: string;
    start_date: string;
    benefits: string[];
  };
}

export interface Analytics {
  total_applications: number;
  applications_this_week: number;
  interview_rate: number;
  offer_rate: number;
  average_time_to_interview: number;
  weekly_goal_progress: number;
  top_applied_companies: string[];
  most_common_job_titles: string[];
  application_trends: {
    date: string;
    count: number;
  }[];
}

export interface ApplicationStats {
  total: number;
  thisWeek: number;
  pending: number;
  interviewing: number;
  offered: number;
  rejected: number;
}

export interface WeeklyGoal {
  target: number;
  current: number;
  progress: number;
}

export interface ActivityData {
  date: string;
  applications: number;
  interviews: number;
  offers: number;
} 