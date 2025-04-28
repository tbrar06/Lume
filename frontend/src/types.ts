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
  job_id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: string;
  description?: string | null;
  requirements?: string[] | null;
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  } | null;
  posted_date?: string | null;
  is_remote?: boolean | null;
  num_applicants?: number | null;
  experience_level?: string | null;
  job_type?: string | null;
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