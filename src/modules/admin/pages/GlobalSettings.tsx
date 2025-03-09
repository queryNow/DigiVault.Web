import React from 'react';
import { Globe } from 'lucide-react';

const GlobalSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Globe className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Configuration</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure global system settings and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">General Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Basic system configuration options
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Security Settings</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure security and access controls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;