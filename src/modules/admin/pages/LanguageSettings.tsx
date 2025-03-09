import React from 'react';
import { Languages } from 'lucide-react';

const LanguageSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Languages className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Language Settings</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Language Management</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure and manage supported languages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Supported Languages</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage available language options
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white">Translations</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage content translations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettings;