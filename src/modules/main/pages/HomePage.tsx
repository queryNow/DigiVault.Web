import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';

const HomePage: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to DigiVault</h1>
      <div className="prose prose-indigo dark:prose-invert max-w-none">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Your secure digital asset management solution
        </p>
        {isAuthenticated ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">Manage Assets</h3>
                <p className="text-gray-600 dark:text-gray-300">View and manage your digital assets</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">Document Center</h3>
                <p className="text-gray-600 dark:text-gray-300">Access your important documents</p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <h3 className="font-medium text-gray-900 dark:text-white">System Settings</h3>
                <p className="text-gray-600 dark:text-gray-300">Configure your preferences</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">Please log in to access your secure vault.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;