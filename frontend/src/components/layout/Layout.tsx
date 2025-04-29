import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { themeMode } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className={`flex-1 transition-all ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'
        } pt-4 px-4 sm:px-6 lg:px-8`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 