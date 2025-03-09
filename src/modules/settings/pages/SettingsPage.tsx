import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-indigo-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your application preferences and account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;