import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication } from '../types';

interface SearchParams {
  [key: string]: string | undefined;
  query?: string;
  location?: string;
  remote?: string;
}

interface JobContextType {
  jobs: Job[];
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  fetchJobs: (searchParams?: SearchParams) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  updateApplication: (applicationId: string, status: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (searchParams?: SearchParams) => {
    try {
      setLoading(true);
      // Filter out undefined values and convert to Record<string, string>
      const params = searchParams ? Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined)
      ) as Record<string, string> : undefined;
      
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`/api/jobs${queryString ? `?${queryString}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const applyToJob = async (jobId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      if (!response.ok) throw new Error('Failed to apply to job');
      await fetchApplications();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (applicationId: string, status: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update application');
      await fetchApplications();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <JobContext.Provider
      value={{
        jobs,
        applications,
        loading,
        error,
        fetchJobs,
        applyToJob,
        updateApplication,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 