import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MainLayout } from '../templates/MainLayout';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'external';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = true,
  requiredRole,
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // If authentication is required and the user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the user doesn't have that role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If all conditions are met, render the child routes
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
