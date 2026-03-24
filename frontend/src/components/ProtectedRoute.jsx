import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};
