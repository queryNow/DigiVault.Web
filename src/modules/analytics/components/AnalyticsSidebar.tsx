import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, LineChart, FileBox, Files } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Usage Analytics', href: '/analytics/usage', icon: BarChart2, description: 'Track and view usage metrics across the platform.' },
  { name: 'Detailed Analytics', href: '/analytics/details', icon: LineChart, description: 'View detailed information and reports.' },
  { name: 'Asset Analytics', href: '/analytics/apps', icon: FileBox, description: 'Manage digital assets and resources.' },
  { name: 'Document Analytics', href: '/analytics/workspaces', icon: Files, description: 'Organize and manage documents across the system.' },
];

const AnalyticsSidebar: React.FC = () => {
  return (
    <nav className="flex-1 px-4 py-6">
      <div className="mb-6">
        <h2 className="px-2 text-lg font-semibold text-gray-900 dark:text-white">Analytics</h2>
        <p className="px-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
          View and analyze platform metrics
        </p>
      </div>
      <ul role="list" className="space-y-2">
        {navigation.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                  isActive
                    ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                )
              }
              title={item.description}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      'h-6 w-6',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500'
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AnalyticsSidebar;