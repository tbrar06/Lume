import React from 'react';
import { useJobs } from '../contexts/JobContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Applications: React.FC = () => {
  const { applications, jobs, loading, error, updateApplication } = useJobs();

  const getJobDetails = (jobId: string) => {
    return jobs.find(job => job.job_id === jobId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your job applications
          </p>
        </div>

        {applications.length === 0 ? (
          <Card variant="elevated">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Start applying to jobs to see them here.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map(application => {
              const job = getJobDetails(application.job_id);
              if (!job) return null;

              return (
                <Card key={application.id} variant="elevated">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Applied {formatDate(application.applied_date)}</span>
                    </div>

                    {application.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Notes</h4>
                        <p className="mt-1 text-sm text-gray-600">{application.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(job.url, '_blank')}
                      >
                        View Job
                      </Button>
                      <div className="flex space-x-2">
                        <select
                          value={application.status}
                          onChange={(e) => updateApplication(application.id, e.target.value)}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="applied">Applied</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                          <option value="accepted">Accepted</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications; 