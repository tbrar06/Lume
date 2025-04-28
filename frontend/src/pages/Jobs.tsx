import React, { useState } from 'react';
import { useJobs } from '../contexts/JobContext';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import Card from '../components/Card';

const Jobs: React.FC = () => {
  const { jobs, applications, loading, error, fetchJobs, applyToJob } = useJobs();
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    remote: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert searchParams to the expected format
    const params = {
      query: searchParams.query,
      location: searchParams.location,
      remote: searchParams.remote.toString(),
    };
    fetchJobs(params);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Next Job</h1>

        <Card variant="elevated" className="mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                  Job Title or Keywords
                </label>
                <input
                  type="text"
                  name="query"
                  id="query"
                  value={searchParams.query}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={searchParams.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. San Francisco"
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="remote"
                    id="remote"
                    checked={searchParams.remote}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remote" className="ml-2 block text-sm text-gray-900">
                    Remote Only
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                Search Jobs
              </Button>
            </div>
          </form>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onApply={applyToJob}
                isApplied={applications.some(app => app.job_id === job.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search criteria to find more jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 