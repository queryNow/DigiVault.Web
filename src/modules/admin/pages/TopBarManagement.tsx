import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation, UserCircle, HelpCircle } from 'lucide-react';

const TopBarManagement: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'nav' | 'profile' | 'help'>('nav');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    switch (hash) {
      case 'UP':
        setActiveTab('profile');
        break;
      case 'HP':
        setActiveTab('help');
        break;
      default:
        setActiveTab('nav');
    }
  }, [location]);

  const getIcon = () => {
    switch (activeTab) {
      case 'profile':
        return <UserCircle className="h-8 w-8 text-indigo-600" />;
      case 'help':
        return <HelpCircle className="h-8 w-8 text-indigo-600" />;
      default:
        return <Navigation className="h-8 w-8 text-indigo-600" />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'profile':
        return 'User Profile Settings';
      case 'help':
        return 'Help Settings';
      default:
        return 'Navigation Settings';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        {getIcon()}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('nav')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'nav'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Navigation
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'profile'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              User Profile
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'help'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Help
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'nav' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Configure the top navigation menu structure and settings.
              </p>
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Manage user profile settings and preferences.
              </p>
            </div>
          )}
          {activeTab === 'help' && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Configure help and support settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBarManagement;