import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Users, Group as UserGroup } from 'lucide-react';
import UserTable from '../components/UserTable';
import GroupTable from '../components/GroupTable';

const UserManagement: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'users' | 'groups'>('users');

  useEffect(() => {
    const hash = location.hash.split('?')[0].replace('#', '');
    if (hash === 'GRP') {
      setActiveTab('groups');
    } else if (hash === 'USR') {
      setActiveTab('users');
    }
  }, [location.hash]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-x-3">
        {activeTab === 'users' ? (
          <Users className="h-8 w-8 text-indigo-600" />
        ) : (
          <UserGroup className="h-8 w-8 text-indigo-600" />
        )}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeTab === 'users' ? 'User Management' : 'Group Management'}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'groups'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Groups
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' ? (
            <UserTable />
          ) : (
            <GroupTable />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;