import React from 'react';
import { Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        <Settings className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">User Management</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage user accounts and permissions
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">System Settings</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure system-wide settings
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white">Security</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor and manage security settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;