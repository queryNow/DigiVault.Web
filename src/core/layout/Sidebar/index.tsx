import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileBox,
    Store,
    LogOut,
    Settings as SettingsIcon,
    BarChart,
    Bot,
    ChevronLeft,
    ChevronRight,
    Bell,
    User
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import NotificationsDialog from './NotificationsDialog';
import ProfileDialog from './ProfileDialog';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Asset Management', href: '/assets', icon: FileBox },
    { name: 'DocuVault', href: '/docuvault', icon: FileBox },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Reports', href: '/reports', icon: BarChart },
    { name: 'AI Assistant', href: '/ai', icon: Bot },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

interface SidebarProps {
    isCollapsed: boolean;
    toggleCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, toggleCollapsed }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get job title from user profile, fallback to a default if not available
    const jobTitle = user?.jobTitle || user?.title || 'Administrator';

    const userProfile = {
        name: user?.name || 'User',
        email: user?.username || user?.email || '',
        role: jobTitle,
        avatar: user?.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format'
    };
    return (
        <>
            <div className={`${isCollapsed ? 'w-16' : 'w-64'} flex-shrink-0 transition-all duration-300 fixed h-full z-10`}>
                <div className="flex flex-col h-full bg-white border-r relative">

                    {/* Collapse/Expand Button */}
                    <button
                        onClick={() => toggleCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                        )}
                    </button>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                        <nav className="px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href ||
                                    (item.href !== '/' && location.pathname.startsWith(item.href));

                                if (item.name === "Settings" && !user.Contribute) return;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${isActive
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <Icon className={`${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                                            } flex-shrink-0 h-6 w-6`} />
                                        {!isCollapsed && <span className="ml-3">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User Profile */}
                    <div className="flex-shrink-0 border-t border-gray-200 p-4">
                        <div className="flex-shrink-0 w-full group">
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfile(true)}
                                        className="relative flex items-center"
                                    >
                                        {user?.photo ? (
                                            <img
                                                className="h-8 w-8 rounded-full object-cover"
                                                src={user.photo}
                                                alt="Profile"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-500" />
                                            </div>
                                        )}
                                        <div className={`${isCollapsed ? 'hidden' : 'ml-3'}`}>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                                {userProfile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {userProfile.role}
                                            </p>
                                        </div>
                                    </button>
                                </div>

                                {!isCollapsed && (
                                    <div className="ml-auto flex items-center space-x-2">
                                        <button
                                            onClick={() => setShowNotifications(true)}
                                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                                        >
                                            <Bell className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                                        >
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showNotifications && (
                <NotificationsDialog
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            )}

            {showProfile && (
                <ProfileDialog
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                    profile={userProfile}
                />
            )}
        </>
    )
}

export default Sidebar;