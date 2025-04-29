import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { JobProvider } from './contexts/JobContext';
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Skills from './pages/Skills';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AppProvider>
      <ProfileProvider>
        <JobProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="applications" element={<Applications />} />
                <Route path="skills" element={<Skills />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </JobProvider>
      </ProfileProvider>
    </AppProvider>
  );
}

export default App; 