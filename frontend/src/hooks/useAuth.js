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

/*
Autor: Erick Rangel

Descripción: Hook personalizado para manejar toda la lógica de autenticación

Parámetros: ninguno

Retorna: Objeto con user, loading, error, register, login, forgotPassword, resetPassword, logout, clearError, isAuthenticated
*/
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /*
  Autor: Erick Rangel
  
  Descripción: Restaura la sesión del usuario desde localStorage al montar el componente
  
  Parámetros: ninguno
  
  Retorna: void
  */
  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();

    if (token && savedUser) {
      setUser({ ...savedUser, isAuthenticated: true });
    }
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Registra un nuevo usuario en el sistema
  
  Parámetros: userData - Datos del usuario a registrar
  
  Retorna: Response del servidor
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

  /*
  Autor: Erick Rangel
  
  Descripción: Inicia sesión con credenciales y guarda token y usuario
  
  Parámetros: credentials - Objeto con email y password
  
  Retorna: Response del servidor con token y datos del usuario
  */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      authService.saveToken(response.access_token);
      authService.saveUser(response.user);

      setUser({
        ...response.user,
        isAuthenticated: true
      });

      setLoading(false);
      window.location.href = '/';
      return response;

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error en el login');
      throw error;
    }
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Solicita recuperación de contraseña mediante email
  
  Parámetros: data - Objeto con username y email
  
  Retorna: Response del servidor
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

  /*
  Autor: Erick Rangel
  
  Descripción: Restablece la contraseña usando token de recuperación
  
  Parámetros: token - Código de verificación, newPassword - Nueva contraseña
  
  Retorna: Response del servidor
  */
  const resetPassword = useCallback(async (token, newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(token, newPassword);
      setLoading(false);
      return response;

    } catch (error) {
      setLoading(false);
      setError(error.message || 'Error en el reseteo de contraseña');
      throw error;
    }
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Cierra sesión del usuario y limpia todo el estado
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const logout = useCallback(() => {
    authService.removeToken();
    authService.removeUser();

    setUser(null);
    setError(null);

    window.location.href = '/';
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Limpia los errores del estado
  
  Parámetros: ninguno
  
  Retorna: void
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
    resetPassword,
    logout,
    clearError,
    isAuthenticated: !!user?.isAuthenticated
  };
};