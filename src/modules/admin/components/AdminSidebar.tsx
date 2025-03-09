import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdminApi } from '../../../services/api/adminApi';
import type { AdminNavigationItem } from '../../../services/api/adminApi';
import { Settings, LayoutDashboard, Shield, Home, LineChart, Database, Palette, Languages, Coins, Users, Group as UserGroup, Globe, Navigation, Smartphone, UserCircle, HelpCircle, FileText, BarChart3, FileBox, Files } from 'lucide-react';
import clsx from 'clsx';
import LoadingSpinner from '../../../core/components/LoadingSpinner';

const iconMap: Record<string, React.ComponentType<any>> = {
  'dashboard': LayoutDashboard,
  'security': Shield,
  'settings': Settings,
  'format_line_spacing': Database,
  'home': Home,
  'show_chart': LineChart,
  'default': Settings
};

const getIconByName = (iconName: string): React.ComponentType<any> => {
  // Map specific paths to icons
  const pathIconMap: Record<string, React.ComponentType<any>> = {
    '/admin/user-management#USR': Users,
    '/admin/user-management#GRP': UserGroup,
    '/admin/global-settings': Globe,
    '/admin/top-bar-mgmt#GN': Navigation,
    '/admin/mobile-settings': Smartphone,
    '/admin/top-bar-mgmt#UP': UserCircle,
    '/admin/top-bar-mgmt#HP': HelpCircle,
    '/admin/metadata-management': FileText,
    '/admin/themes': Palette,
    '/admin/languages': Languages,
    '/admin/currency': Coins,
    'analytics/usage': BarChart3,
    'analytics/details': LineChart,
    'analytics/apps': FileBox,
    'analytics/workspaces': Files
  };

  // First check if we have a direct icon name match
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }

  // Then check if we have a path match
  const Icon = pathIconMap[iconName] || Settings;
  return Icon;
};

const AdminSidebar: React.FC = () => {
  const adminApi = useAdminApi();
  const location = useLocation();
  const navigate = useNavigate();
  const [navigation, setNavigation] = useState<AdminNavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchNavigation = async () => {
      try {
        setIsLoading(true);
        const items = await adminApi.getAdminNavigation();
        if (mounted) {
          const sortedItems = items
            .filter(item => item.EnableNav)
            .sort((a, b) => a.DisplayOrder - b.DisplayOrder);
          setNavigation(sortedItems);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to fetch admin navigation:', err);
          setError('Failed to load navigation');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNavigation();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const handleNavigation = (item: AdminNavigationItem) => {
    if (item.Link) {
      // Handle analytics paths
      if (item.Link.startsWith('analytics/')) {
        navigate(`/${item.Link}`);
      } else {
        // Handle regular paths and hash routes
        navigate(item.Link);
      }
    }
  };

  const renderNavItem = (item: AdminNavigationItem) => {
    const subItems = navigation.filter(subItem => subItem.ParentId === item.Id);
    const Icon = getIconByName(item.Icon || item.Link);
    const hasSubItems = subItems.length > 0;
    
    // Check if current path matches item's link or any of its subitems' links
    const isActive = location.pathname === item.Link || 
                    (item.Link && location.pathname + location.hash === item.Link) ||
                    (hasSubItems && subItems.some(subItem => 
                      location.pathname === subItem.Link || 
                      location.pathname + location.hash === subItem.Link
                    ));

    // For parent items with subitems
    if (hasSubItems) {
      return (
        <li key={item.Id}>
          <div
            className={clsx(
              'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
              isActive
                ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
            title={item.Description}
          >
            <Icon
              className={clsx(
                'h-5 w-5',
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500'
              )}
            />
            <span>{item.Title}</span>
          </div>
          <ul className="mt-1 ml-8 space-y-1">
            {subItems.map(subItem => renderNavItem(subItem))}
          </ul>
        </li>
      );
    }

    // For items with direct links
    return (
      <li key={item.Id}>
        <div
          onClick={() => handleNavigation(item)}
          className={clsx(
            'group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold cursor-pointer',
            (location.pathname === item.Link || location.pathname + location.hash === item.Link)
              ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
          title={item.Description}
        >
          <Icon
            className={clsx(
              'h-5 w-5',
              (location.pathname === item.Link || location.pathname + location.hash === item.Link)
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500'
            )}
          />
          <span>{item.Title}</span>
        </div>
      </li>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  const rootItems = navigation.filter(item => item.ParentId === 0);

  return (
    <nav className="flex-1 px-4 py-6">
      <ul role="list" className="space-y-2">
        {rootItems.map(item => renderNavItem(item))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;