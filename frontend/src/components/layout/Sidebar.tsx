import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase as BriefcaseBusiness, BookOpen, BarChart2, Settings, User, Award } from 'lucide-react';

const navItems = [
  { path: '/app/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/app/jobs', icon: <BriefcaseBusiness size={20} />, label: 'Jobs' },
  { path: '/app/skills', icon: <Award size={20} />, label: 'Skills' },
  { path: '/app/profile', icon: <User size={20} />, label: 'Profile' },
  { path: '/app/settings', icon: <Settings size={20} />, label: 'Settings' },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle, isMobile = false }) => {
  const location = useLocation();
  
  const sidebarVariants = {
    expanded: {
      width: '240px',
      transition: {
        duration: 0.3,
      },
    },
    collapsed: {
      width: '72px',
      transition: {
        duration: 0.3,
      },
    },
  };

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      onToggle?.();
    }
  }, [isMobile, onToggle]);

  return (
    <motion.aside
      className="fixed left-0 top-16 h-[calc(100vh-64px)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-40 overflow-hidden"
      initial={collapsed ? 'collapsed' : 'expanded'}
      animate={collapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
    >
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`mr-3 flex-shrink-0 ${isActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.icon}
                </div>
                <motion.span
                  initial={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }}
                  animate={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'block' }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar; 