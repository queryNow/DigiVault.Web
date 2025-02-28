import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, ChevronRight } from 'lucide-react';
import { buildNavigation } from '../../utils/types/navigation';
import { AdminService } from '../../utils/services/AdminService';
import { useAuth } from '../../core/auth/AuthProvider';

export default function Settings() {
  const location = useLocation();
  const { instance } = useAuth();
  const [adminNavData, setAdminNavData] = useState([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const adminService = useMemo(() => new AdminService(instance), [instance]);
  const navigationItems = buildNavigation(adminNavData);

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const fetchAdminNavData = useCallback(async () => {
    const response = await adminService.getAdminNavigationItems();
    setAdminNavData(response.value);
  }, [adminService])

  useEffect(() => {
    fetchAdminNavData();
  }, [fetchAdminNavData])

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
          <nav className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon || SettingsIcon;
              const isActive = location.pathname.startsWith(item.href);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItems.includes(item.id);

              return (
                <div key={item.id}>
                  <div
                    className={`
                      group flex items-center justify-between px-3 py-2 text-sm font-medium border-l-4 cursor-pointer
                      ${isActive
                        ? 'bg-gray-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => hasChildren ? toggleExpand(item.id) : null}
                  >
                    <div className="flex items-center">
                      <Icon
                        className={`
                          flex-shrink-0 -ml-1 mr-3 h-6 w-6
                          ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                        `}
                      />
                      <Link to={item.href} className="truncate">
                        {item.title}
                      </Link>
                    </div>
                    {hasChildren && (
                      <ChevronRight
                        className={`
                          h-5 w-5 text-gray-400 transition-transform duration-200
                          ${isExpanded ? 'transform rotate-90' : ''}
                        `}
                      />
                    )}
                  </div>

                  {/* Child Items */}
                  {hasChildren && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children && item.children.map(child => (
                        <Link
                          key={child.id}
                          to={child.href}
                          className={`
                            group flex items-center px-3 py-2 text-sm font-medium rounded-md
                            ${location.pathname === child.href
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="truncate">{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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