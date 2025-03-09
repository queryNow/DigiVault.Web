import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { CoreApi } from '../../services/api/coreApi';
import { GlobalNavigationItem } from '../../services/api/types';
import { Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../auth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const { isLoading: authLoading } = useAuth();
  const [navigation, setNavigation] = useState<GlobalNavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );

  const fetchNavigation = useCallback(async () => {
    if (!isAuthenticated || !accounts[0] || authLoading) {
      setNavigation([]);
      setIsLoading(false);
      return;
    }

    try {
      const coreApi = new CoreApi(() => instance, accounts[0]);
      const items = await coreApi.getGlobalNavigation();
      const internalItems = items
        .filter(item => !item.IsNewTab)
        .sort((a, b) => a.Order - b.Order);
      setNavigation(internalItems);
    } catch (error) {
      console.error('Failed to fetch navigation:', error);
      setNavigation([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, instance, accounts, authLoading]);

  useEffect(() => {
    const controller = new AbortController();
    fetchNavigation();
    return () => controller.abort();
  }, [fetchNavigation]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-between px-4">
      <div className="flex items-center">
        <div className="lg:hidden flex items-center mr-8">
          <img
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&auto=format"
            alt="DigiVault Logo"
            className="h-8 w-8 rounded-lg"
          />
          <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
            DigiVault
          </span>
        </div>
        <nav className="flex space-x-8">
          {navigation.map((item) => {
            const path = new URL(item.Url).pathname;
            const isActive = location.pathname === path;
            
            return (
              <Link
                key={item.Id}
                to={path}
                className={clsx(
                  'px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-150',
                  isActive
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                )}
                title={item.Description}
              >
                {item.Name}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-150"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

export default Navbar;