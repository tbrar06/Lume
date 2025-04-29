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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-x-hidden">
      {/* Animated Gradient/Texture Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-full h-full bg-gradient-to-tr from-primary-200/40 via-white/0 to-primary-400/30 animate-pulse-slow" />
        {/* SVG Texture Overlay */}
        <svg className="absolute top-0 left-0 w-full h-40 opacity-20" viewBox="0 0 1440 320"><path fill="#60a5fa" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </div>
      {/* Hero Section (now includes features) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex flex-col items-center text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Supercharge Your</span>
          <span className="block text-primary-600 dark:text-primary-400">Job Search</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-6 md:text-xl md:max-w-2xl">
          Lume helps you navigate your career journey with AI-powered job matching, skill tracking, and personalized career insights.
        </p>
        <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
          <div className="rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4 px-8 text-lg font-semibold tracking-wide shadow-lg hover:scale-105 transition-transform"
              onClick={() => navigate('/app')}
            >
              Get Started
            </Button>
          </div>
        </div>
        {/* Features Grid moved up here */}
        <div className="mt-10 w-full pb-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="relative p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-primary-100 dark:border-primary-900/30 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl drop-shadow-lg">
            <span className="block">Ready to take control of your career?</span>
            <span className="block text-primary-200">Start your journey with Lume today.</span>
          </h2>
          <div className="mt-10 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Button
                variant="primary"
                size="lg"
                className="w-full py-4 px-8 text-lg font-semibold tracking-wide shadow-lg hover:scale-105 transition-transform bg-white text-primary-700 hover:bg-primary-50 border-2 border-white"
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