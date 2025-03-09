import { RouteObject } from 'react-router-dom';
import { mainRoutes } from './main/routes';
import { adminRoutes } from './admin/routes';
import { authRoutes } from './auth/routes';
import { settingsRoutes } from './settings/routes';
import { analyticsRoutes } from './analytics/routes';

// Combine all protected routes
export const protectedRoutes: RouteObject[] = [
  ...mainRoutes,
  ...adminRoutes,
  ...analyticsRoutes,
  ...settingsRoutes
];

// Public routes (login, etc.)
export const publicRoutes: RouteObject[] = [
  ...authRoutes
];