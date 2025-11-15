/* 
  Autor: Erick Rangel
  hook: useAuth.js
  fecha: 14-11-2025
  descripcion:
  - Verificar si el usuario ya tiene token al cargar el hook
  - Registro de usuarios y redirección al login
  - Inicio de sesión, guardado de token y redirección a la página principal
  - Recuperación de contraseña
  - Cierre de sesión y limpieza de estado
  - soporta estados de carga y manejo de errores
  - comprueba si el usuario está autenticado con isAuthenticated
  usa authService para comunicarse con el backend
*/

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

/**
 * Hook para manejar autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Restaurar sesión al cargar la app
   */
  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      setUser({ ...savedUser, isAuthenticated: true });
    }
  }, []);

  /**
   * Maneja el proceso de registro de usuario
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      setLoading(false);
      navigate('/auth?mode=login');
      return response;

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error en el registro');
      throw error;
    }
  }, [navigate]);

  /**
   * Maneja el proceso de inicio de sesión
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Guardar token y usuario
      authService.saveToken(response.access_token);
      authService.saveUser(response.user);

      setUser({
        ...response.user,
        isAuthenticated: true
      });

      setLoading(false);
      navigate('/');
      return response;

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error en el login');
      throw error;
    }
  }, [navigate]);

  /**
   * Maneja el proceso de recuperación de contraseña
   */
  const forgotPassword = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(data);
      setLoading(false);
      return response;

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error en la recuperación de contraseña');
      throw error;
    }
  }, []);

  /**
   * Cierra la sesión del usuario
   */
  const logout = useCallback(() => {
    authService.removeToken();
    authService.removeUser();

    setUser(null);
    setError(null);

    navigate('/');
  }, [navigate]);

  /**
   * Limpia los errores del estado
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    register,
    login,
    forgotPassword,
    logout,
    clearError,
    isAuthenticated: !!user?.isAuthenticated
  };
};