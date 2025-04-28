import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication } from '../types';

interface JobContextType {
  jobs: Job[];
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  updateApplication: (applicationId: string, status: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const TEST_USER_ID = 'test123';

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/jobs/${TEST_USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []); // backend returns {timestamp, jobs}
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch('/applications');
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
      const response = await fetch('/applications', {
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
      const response = await fetch(`/applications/${applicationId}`, {
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