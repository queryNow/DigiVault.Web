import { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AssetsPage from './pages/AssetsPage';
import DocumentsPage from './pages/DocumentsPage';

export const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/assets',
    element: <AssetsPage />
  },
  {
    path: '/documents',
    element: <DocumentsPage />
  }
];