import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';

/**
 * Protected route wrapper.
 * Si el usuario está autenticado renderiza los children via <Outlet />
 * Si no, redirige a la página de autenticación.
 */
const Protected = () => {
  // Usar comprobación síncrona para evitar render inicial que redirige
  // antes de que `useAuth` pueda restaurar el estado desde localStorage.
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/auth" replace />;
};

export default Protected;
