/*
  Autor: Erick Rangel
  servicio: authService.js
  fecha: 14-11-2025

  Centraliza todas las operaciones relacionadas con la autenticación de usuarios:
  - Registro de nuevos usuarios
  - Inicio de sesión
  - Recuperación de contraseña
  - Manejo token JWT en el almacenamiento local 
  - Verificación de si un usuario está autenticado

  apiCliente se comunica al backend.
*/
import { apiClient } from './api.js';

/**
 * Servicio para manejar todas las operaciones de autenticación
 */
export const authService = {
  /**
   * Registra un nuevo usuario en el sistema
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  /**
   * Inicia sesión con email y contraseña
   */
  async login(credentials) {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    try {
      const response = await apiClient.request('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async forgotPassword(data) {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', data);
      return response;
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      throw error;
    }
  },

  saveToken(token) {
    localStorage.setItem('access_token', token);
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  removeToken() {
    localStorage.removeItem('access_token');
  },

  /**
   * Usuario
   */
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  /**
   * Verifica si hay token guardado
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};