import React from 'react';
import { Job } from '../types';
import Card from './Card';
import Button from './Button';

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  isApplied?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, isApplied = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card variant="elevated" className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <div className="flex items-center space-x-2">
            {job.is_remote && (
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Remote
              </span>
            )}
            {job.experience_level && (
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                {job.experience_level}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          {job.posted_date && (
            <>
              <span className="mx-2">•</span>
              <span>Posted {formatDate(job.posted_date)}</span>
            </>
          )}
        </div>

        {job.salary_range && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Salary: </span>
            {job.salary_range.currency} {job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()}
          </div>
        )}

        {job.description && (
          <div className="text-sm text-gray-600 line-clamp-3">{job.description}</div>
        )}

        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index}>{req}</li>
              ))}
              {job.requirements.length > 3 && (
                <li className="text-gray-500">+{job.requirements.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(job.url, '_blank')}
            className="w-full"
          >
            View Job on {job.source}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JobCard; 