import React, { useEffect, useState } from 'react';
import { BarChart2, BriefcaseBusiness, FileCheck, Award } from 'lucide-react';
import { useJobs } from '../contexts/JobContext';
import { JobApplication } from '../types';

const Dashboard: React.FC = () => {
  const { applications, jobs, loading, error } = useJobs();
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    weeklyApplications: 0,
    responseRate: 0,
    weeklyGoalProgress: 0
  });

  useEffect(() => {
    if (applications.length > 0) {
      const now = new Date();
      const weekStart = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
      
      // Calculate weekly applications
      const weeklyApplications = applications.filter(app => 
        new Date(app.applied_date) >= weekStart
      );

      // Calculate response rate (applications that moved beyond 'applied' status)
      const respondedApplications = applications.filter(app => 
        app.status !== 'applied'
      );

      // Calculate weekly goal progress
      const weeklyGoal = 10; // Default goal, should come from user profile
      const weeklyProgress = Math.min(weeklyApplications.length / weeklyGoal * 100, 100);

      setMetrics({
        totalApplications: applications.length,
        weeklyApplications: weeklyApplications.length,
        responseRate: applications.length > 0 
          ? Math.round((respondedApplications.length / applications.length) * 100) 
          : 0,
        weeklyGoalProgress: Math.round(weeklyProgress)
      });
    }
  }, [applications]);

  const getJobDetails = (jobId: string) => {
    return jobs.find(job => job.job_id === jobId);
  };

  const statsCards = [
    {
      title: 'Active Applications',
      value: metrics.totalApplications.toString(),
      change: `+${metrics.weeklyApplications} this week`,
      icon: <FileCheck className="h-6 w-6 text-primary-500" />,
    },
    {
      title: 'Response Rate',
      value: `${metrics.responseRate}%`,
      change: metrics.responseRate > 0 ? 'of applications received responses' : 'No responses yet',
      icon: <Award className="h-6 w-6 text-primary-500" />,
    },
    {
      title: 'Weekly Progress',
      value: `${metrics.weeklyGoalProgress}%`,
      change: metrics.weeklyGoalProgress >= 100 ? 'Goal achieved!' : 'Keep going!',
      icon: <BarChart2 className="h-6 w-6 text-primary-500" />,
    },
    {
      title: 'This Week',
      value: metrics.weeklyApplications.toString(),
      change: 'applications submitted',
      icon: <BriefcaseBusiness className="h-6 w-6 text-primary-500" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's what's happening with your job search
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{card.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.title}
                    </dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {card.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              {applications.length > 0 ? (
                applications.slice(0, 5).map((app) => {
                  const job = getJobDetails(app.job_id);
                  if (!job) return null;
                  
                  return (
                    <div key={app.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {job.title} - {job.company}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Applied on {new Date(app.applied_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.status === 'applied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        app.status === 'interviewing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        app.status === 'offered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Application Status</h2>
            <div className="mt-4 space-y-4">
              {applications.length > 0 ? (
                <div className="space-y-2">
                  {['applied', 'interviewing', 'offered', 'rejected'].map((status) => {
                    const count = applications.filter(app => app.status === status).length;
                    const percentage = Math.round((count / applications.length) * 100);
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {status}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {count} ({percentage}%)
                          </span>
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                status === 'applied' ? 'bg-blue-500' :
                                status === 'interviewing' ? 'bg-yellow-500' :
                                status === 'offered' ? 'bg-green-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No applications yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 