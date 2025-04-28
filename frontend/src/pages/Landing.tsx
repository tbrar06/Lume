import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const features = [
  {
    title: 'AI-Powered Job Search',
    description: 'Get personalized job recommendations powered by advanced AI algorithms tailored to your skills and preferences.',
    icon: (
      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 0h-1v-4h-1m-4 0h-1v-4h-1m4 0h-1v-4h-1" /></svg>
    ),
  },
  {
    title: 'Track Applications',
    description: 'Easily manage and track all your job applications in one place, from applied to interview to offer.',
    icon: (
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ),
  },
  {
    title: 'Profile Management',
    description: 'Build and update your professional profile to get matched with the best opportunities.',
    icon: (
      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
  },
];

const Landing: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-50 to-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to <span className="text-blue-600">Lume</span></h1>
          <p className="text-xl text-gray-700 mb-8">Your AI-powered assistant for smarter, faster job searching and application tracking.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/jobs">
              <Button size="lg" variant="primary">Get Started</Button>
            </Link>
            <Link to="/profile">
              <Button size="lg" variant="outline">Build Your Profile</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Why Choose Lume?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-6 text-center shadow-sm">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to land your dream job?</h2>
            <p className="text-lg text-gray-700 mb-8">Sign up, create your profile, and start applying today with Lume.</p>
            <Link to="/jobs">
              <Button size="lg" variant="primary">Start Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="py-6 bg-white border-t text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Lume. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing; 