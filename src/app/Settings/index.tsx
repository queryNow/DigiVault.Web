import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, Users, Building2, FileText, Store, BarChart } from 'lucide-react';

const navigation = [
  { name: 'General', href: '/settings/general', icon: SettingsIcon, description: 'Basic platform settings like branding and localization' },
  { name: 'Permissions', href: '/settings/permissions', icon: Users, description: 'Manage users, roles and access control' },
  { name: 'Asset Settings', href: '/settings/assets', icon: Building2, description: 'Configure asset types and properties' },
  { name: 'Document Settings', href: '/settings/documents', icon: FileText, description: 'Document categories and metadata settings' },
  { name: 'Marketplace Settings', href: '/settings/marketplace', icon: Store, description: 'Trading and marketplace configuration' },
  { name: 'Reports Settings', href: '/settings/reports', icon: BarChart, description: 'Configure reports and analytics settings' },
];

export default function Settings() {
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your platform settings and configurations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-50 border-indigo-500 text-indigo-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium border-l-4`}
                >
                  <Icon
                    className={`${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Help */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Need Help?</h3>
            <p className="mt-2 text-sm text-blue-700">
              Check our documentation or contact support for assistance with platform settings.
            </p>
            <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500">
              View Documentation
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white shadow rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}