import { RouteObject } from 'react-router-dom';
import { AdminRoute } from '../../core/auth';
import AnalyticsLayout from './layout/AnalyticsLayout';
import Analytics from './pages/Analytics';

export const analyticsRoutes: RouteObject[] = [
  {
    path: '/analytics',
    element: <AdminRoute><AnalyticsLayout /></AdminRoute>,
    children: [
      { index: true, element: <Analytics /> },
      { path: 'usage', element: <Analytics /> },
      { path: 'details', element: <Analytics /> },
      { path: 'apps', element: <Analytics /> },
      { path: 'workspaces', element: <Analytics /> }
    ]
  }
];