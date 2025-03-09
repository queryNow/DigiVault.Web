import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { useAuth } from '../../core/auth';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from '../../core/components/LoadingSpinner';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  const isAuthenticated = useIsAuthenticated();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <AuthGuard><LoginPage /></AuthGuard>
  }
];