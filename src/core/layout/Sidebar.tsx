import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { 
  LayoutDashboard, 
  FileBox, 
  Store, 
  BarChart, 
  Bot, 
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../auth';
import { loginRequest } from '../auth/msal-config';
import { CoreApi } from '../../services/api/coreApi';
import LoadingSpinner from '../components/LoadingSpinner';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Asset Management', href: '/assets', icon: FileBox },
  { name: 'DocuVault', href: '/documents', icon: FileBox },
  { name: 'Marketplace', href: '/marketplace', icon: Store },
  { name: 'Reports', href: '/analytics', icon: BarChart, requiresAdmin: true  },
  { name: 'AI Assistant', href: '/ai', icon: Bot },
  { name: 'Settings', href: '/admin', icon: SettingsIcon, requiresAdmin: true },
];

interface SidebarProps {
  mobile?: boolean;
}

interface UserData {
  Name: string;
  Roles: Array<{ Name: string; Precedence: number }>;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile }) => {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !accounts[0] || authLoading) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    try {
      const coreApi = new CoreApi(() => instance, accounts[0]);
      const data = await coreApi.getCurrentUser();
      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, instance, accounts, authLoading]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUserData();
    return () => controller.abort();
  }, [fetchUserData]);

  const handleLogin = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      navigate('/login', { replace: true });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
        <button
          onClick={handleLogin}
          className="w-full flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <LogIn className="h-5 w-5 text-gray-400" />
          Sign in
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner fullScreen={false} />;
  }

  return (
    <div className={clsx(
      'flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-6',
      mobile ? 'h-[calc(100vh-4rem)]' : 'h-screen'
    )}>
      {!mobile && (
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto rounded-lg"
            src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&auto=format"
            alt="DigiVault"
          />
          <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">DigiVault</span>
        </div>
      )}
      <nav className="flex flex-1 flex-col justify-between">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                if (item.requiresAdmin && !isAdmin) {
                  return null;
                }

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        clsx(
                          isActive
                            ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={clsx(
                              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>

        <div className="mt-auto pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center min-w-0">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userData?.Name || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData?.Roles?.map(role => role.Name).join(', ') || 'Loading roles...'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;