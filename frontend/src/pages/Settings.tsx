import React from 'react';
import { Bell, Moon, Globe, Lock } from 'lucide-react';
import Button from '../components/Button';
import { useApp } from '../contexts/AppContext';

const Settings: React.FC = () => {
  const { themeMode, toggleTheme } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-primary-500" />
              <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email updates about your job applications
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-primary-600"
                  role="switch"
                  aria-checked="true"
                >
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications for new job matches
                  </p>
                </div>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200 dark:bg-gray-700"
                  role="switch"
                  aria-checked="false"
                >
                  <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <Moon className="h-6 w-6 text-primary-500" />
              <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Appearance
              </h2>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle dark mode on or off
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    themeMode === 'dark' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={themeMode === 'dark'}
                >
                  <span 
                    className={`${
                      themeMode === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <Lock className="h-6 w-6 text-primary-500" />
              <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Privacy
              </h2>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Profile Visibility
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Control who can see your profile
                  </p>
                </div>
                <select className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
                  <option>Public</option>
                  <option>Private</option>
                  <option>Connections Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 