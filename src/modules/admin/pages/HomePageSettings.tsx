import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, FilterIcon as FooterIcon } from 'lucide-react';

const HomePageSettings: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'general' | 'footer'>('general');

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'FO') {
      setActiveTab('footer');
    } else {
      setActiveTab('general');
    }
  }, [location]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Home className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homepage Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('footer')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'footer'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Footer
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' ? (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Configure general homepage settings and layout.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Layout</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure homepage layout and sections
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Content</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage homepage content and features
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Customize footer content and appearance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Footer Links</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage footer navigation links
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Footer Content</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure footer content and information
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePageSettings;