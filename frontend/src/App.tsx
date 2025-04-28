import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './contexts/ProfileContext';
import { JobProvider } from './contexts/JobContext';
import Navigation from './components/Navigation';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import Landing from './pages/Landing';

const App: React.FC = () => {
  return (
    <Router>
      <ProfileProvider>
        <JobProvider>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/applications" element={<Applications />} />
              </Routes>
            </main>
          </div>
        </JobProvider>
      </ProfileProvider>
    </Router>
  );
};

export default App; 