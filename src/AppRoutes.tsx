import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useAuth, UnauthorizedPage } from './core/auth';
import { protectedRoutes, publicRoutes } from './modules/routes';
import LoadingSpinner from './core/components/LoadingSpinner';
import { Layout } from './core/layout';

const AppRoutes: React.FC = () => {
  const { isAuthorized, isLoading: authLoading } = useAuth();
  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Show loading spinner while authentication is in progress or while checking authorization
  const isLoading = authLoading || inProgress !== 'none';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              route.element
            )
          }
        />
      ))}

      {/* Protected Routes */}
      <Route element={<Layout />}>
        {protectedRoutes.map((route) => {
          const ProtectedElement = () => {
            if (!isAuthenticated) {
              return <Navigate to="/login" replace />;
            }

            if (!isAuthorized && !isLoading) {
              return <UnauthorizedPage />;
            }

            return route.element;
          };

          if (route.children) {
            return (
              <Route key={route.path} path={route.path} element={<ProtectedElement />}>
                {route.children.map((child) => (
                  <Route
                    key={`${route.path}/${child.path || ''}`}
                    index={child.index}
                    path={child.path}
                    element={child.element}
                  />
                ))}
              </Route>
            );
          }

          return (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedElement />}
            />
          );
        })}
      </Route>

      {/* Catch-all Route */}
      <Route
        path="*"
        element={
          isLoading ? (
            <LoadingSpinner />
          ) : isAuthenticated ? (
            isAuthorized ? (
              <Navigate to="/" replace />
            ) : (
              <UnauthorizedPage />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;