import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { LayoutService } from '../../../utils/services/LayoutService';
import { useAuth } from '../../auth/AuthProvider';


interface NavigationItem {
    Id: string;
    Name: string;
    Url: string;
    IsNewTab: boolean;
}

const Navbar = () => {
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
    const location = useLocation();
    const { instance } = useAuth();
    const layoutService = useMemo(() => new LayoutService(instance), [instance]);

    const fetchNavigationItems = useCallback(async () => {
        const response = await layoutService.getNavigationItems();
        setNavigationItems(response.value.sort((a: any, b: any) => a.Order - b.Order));
    }, [layoutService]);

    useEffect(() => {
        fetchNavigationItems()
    }, [fetchNavigationItems])

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo and Navigation */}
                    <div className="flex">
                        <div className="flex items-center">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="w-8 h-8"
                                    src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=64&h=64&fit=crop&auto=format"
                                    alt="iTouch Logo"
                                />
                                <span className="ml-2 text-xl font-semibold">iTouch DigiVault</span>
                            </div>

                            {/* Navigation Items */}
                            <div className="hidden md:ml-6 md:flex md:space-x-2">
                                {navigationItems.map((item) => {
                                    const isActive = location.pathname === new URL(item.Url).pathname;
                                    const linkProps = item.IsNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

                                    return (
                                        <div key={item.Id} className="relative group">
                                            {item.IsNewTab ? (
                                                <a
                                                    href={item.Url}
                                                    {...linkProps}
                                                    className={`
                            inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 
                            hover:border-gray-300 hover:text-gray-700
                            ${isActive
                                                            ? 'border-indigo-500 text-gray-900'
                                                            : 'border-transparent text-gray-500'
                                                        }
                          `}
                                                >
                                                    {item.Name}
                                                    <ExternalLink className="ml-1 h-4 w-4" />
                                                </a>
                                            ) : (
                                                <Link
                                                    to={new URL(item.Url).pathname}
                                                    className={`
                            inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 
                            hover:border-gray-300 hover:text-gray-700
                            ${isActive
                                                            ? 'border-indigo-500 text-gray-900'
                                                            : 'border-transparent text-gray-500'
                                                        }
                          `}
                                                >
                                                    {item.Name}
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;