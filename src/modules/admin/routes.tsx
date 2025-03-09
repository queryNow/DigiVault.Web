import { RouteObject } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import GlobalSettings from './pages/GlobalSettings';
import TopBarManagement from './pages/TopBarManagement';
import MobileSettings from './pages/MobileSettings';
import HomePageSettings from './pages/HomePageSettings';
import MetadataManagement from './pages/MetadataManagement';
import ThemeSettings from './pages/ThemeSettings';
import LanguageSettings from './pages/LanguageSettings';
import CurrencySettings from './pages/CurrencySettings';
import { AdminRoute } from '../../core/auth';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'user-management', element: <UserManagement /> },
      { path: 'global-settings', element: <GlobalSettings /> },
      { path: 'top-bar-mgmt', element: <TopBarManagement /> },
      { path: 'mobile-settings', element: <MobileSettings /> },
      { path: 'home-page-settings', element: <HomePageSettings /> },
      { path: 'metadata-management', element: <MetadataManagement /> },
      { path: 'themes', element: <ThemeSettings /> },
      { path: 'languages', element: <LanguageSettings /> },
      { path: 'currency', element: <CurrencySettings /> }
    ]
  }
];