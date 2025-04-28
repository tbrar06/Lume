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
  requirements: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  posted_date: string;
  application_url: string;
  is_remote: boolean;
  experience_level?: string;
  job_type?: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'accepted';
  applied_date: string;
  last_updated: string;
  notes?: string;
} 