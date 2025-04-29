import React from 'react';
import { BarChart2, BriefcaseBusiness, FileCheck, Award } from 'lucide-react';

const statsCards = [
  {
    title: 'Active Applications',
    value: '12',
    change: '+2 this week',
    icon: <FileCheck className="h-6 w-6 text-primary-500" />,
  },
  {
    title: 'Jobs Viewed',
    value: '48',
    change: '+15 this week',
    icon: <BriefcaseBusiness className="h-6 w-6 text-primary-500" />,
  },
  {
    title: 'Skills Matched',
    value: '85%',
    change: '+5% this month',
    icon: <Award className="h-6 w-6 text-primary-500" />,
  },
  {
    title: 'Success Rate',
    value: '28%',
    change: '+3% this month',
    icon: <BarChart2 className="h-6 w-6 text-primary-500" />,
  },
];

const Dashboard: React.FC = () => {
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
              <p className="text-gray-600 dark:text-gray-300">Coming soon...</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h2>
            <div className="mt-4 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 