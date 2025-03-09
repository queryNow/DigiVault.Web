import React from 'react';
import { Palette } from 'lucide-react';

const ThemeSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Palette className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Theme Management</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create and manage visual themes for the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Color Schemes</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customize color palettes and schemes
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Typography</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Configure fonts and text styles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;