import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Target, Award, Sparkles } from 'lucide-react';
import Button from '../components/Button';

const features = [
  {
    icon: <Target className="h-6 w-6 text-primary-500" />,
    title: 'Smart Job Matching',
    description: 'AI-powered job recommendations based on your skills and preferences',
  },
  {
    icon: <Briefcase className="h-6 w-6 text-primary-500" />,
    title: 'Application Tracking',
    description: 'Streamlined application management and progress tracking',
  },
  {
    icon: <Award className="h-6 w-6 text-primary-500" />,
    title: 'Skills Development',
    description: 'Track and improve your skills based on market demand',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-primary-500" />,
    title: 'Career Growth',
    description: 'Personalized insights and recommendations for career advancement',
  },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Illuminate Your</span>
            <span className="block text-primary-600 dark:text-primary-500">Career Path</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Lume helps you navigate your career journey with AI-powered job matching, skill tracking, and personalized career insights.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/app')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 dark:bg-primary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to take control of your career?</span>
            <span className="block text-primary-200">Start your journey with Lume today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/app')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 