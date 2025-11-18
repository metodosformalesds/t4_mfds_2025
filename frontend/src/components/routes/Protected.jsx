import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';

const Protected = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
};

export default Protected;
