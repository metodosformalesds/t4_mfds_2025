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
   * @param {Object} userData - Datos del usuario para registro
   * @returns {Promise} Promesa con la respuesta del servidor
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
   * @param {Object} credentials 
   * @returns {Promise}
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

  /**
   * Solicita recuperación de contraseña
   * @param {Object} data - Datos para recuperación (username y email)
   * @returns {Promise} Promesa con la respuesta del servidor
   */
  async forgotPassword(data) {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', data);
      return response;
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      throw error;
    }
  },

  /**
   * Guarda el token JWT en localStorage
   * @param {string} token - Token JWT recibido del servidor
   */
  saveToken(token) {
    localStorage.setItem('access_token', token);
  },

  /**
   * Obtiene el token JWT almacenado
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken() {
    return localStorage.getItem('access_token');
  },

  /**
   * Elimina el token JWT del almacenamiento
   */
  removeToken() {
    localStorage.removeItem('access_token');
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} True si existe un token válido
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};