import React from 'react';
import { useJobs } from '../contexts/JobContext';
import { useProfile } from '../contexts/ProfileContext';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Building2, Laptop, Settings2, Target, Calendar, AlertCircle } from 'lucide-react';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import Card from '../components/Card';

const Jobs: React.FC = () => {
  const { jobs, applications, loading, error, fetchJobs, applyToJob } = useJobs();
  const { profile } = useProfile();

  // Calculate weekly progress
  const weeklyApplications = applications.filter(app => {
    const appDate = new Date(app.applied_date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - appDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  const remainingApplications = (profile?.weekly_application_goal || 0) - weeklyApplications;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Find Your Next Job</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Lume automatically finds jobs matching your preferences and helps you track your applications. 
            Set your weekly application goal and let us help you stay on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Target className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Weekly Goal</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile?.weekly_application_goal || 0} applications per week
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">This Week's Progress</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {weeklyApplications} applications submitted
                </p>
              </div>
            </div>

            {remainingApplications > 0 && (
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Remaining Applications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {remainingApplications} more to reach your weekly goal
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <Card variant="elevated" className="mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Settings2 className="h-5 w-5 text-primary-500" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Job Preferences</h2>
              </div>
              <Link to="/app/profile">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Settings2 className="h-4 w-4" />
                  <span>Update Preferences</span>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Briefcase className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Roles</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {profile?.preferred_roles.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Locations</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {profile?.preferred_locations.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preferred Industries</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {profile?.preferred_industries.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Laptop className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remote Preference</h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {profile?.remote_preference ? 'Remote work preferred' : 'No remote preference'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard
                key={job.job_id}
                job={job}
                onApply={applyToJob}
                isApplied={applications.some(app => app.job_id === job.job_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your preferences in your profile to find more jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs; 