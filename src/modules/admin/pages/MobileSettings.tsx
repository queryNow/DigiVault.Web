import React from 'react';
import { Smartphone } from 'lucide-react';

const MobileSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Smartphone className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mobile Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Mobile Configuration</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure settings for mobile devices and responsive features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Navigation</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Mobile navigation menu settings
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Display</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Mobile display and layout options
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSettings;