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

export const authService = {
  /*
  Autor: Erick Rangel
  
  Descripción: Registra un nuevo usuario en el sistema
  
  Parámetros: userData - Objeto con datos del usuario (username, email, password, etc.)
  
  Retorna: Response del servidor con datos del usuario creado
  */
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Inicia sesión con email y contraseña
  
  Parámetros: credentials - Objeto con email y password
  
  Retorna: Response con access_token y datos del usuario
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
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Solicita recuperación de contraseña enviando código al email
  
  Parámetros: data - Objeto con username y email
  
  Retorna: Response de confirmación del servidor
  */
  async forgotPassword(data) {
    try {
      const response = await apiClient.post(
        `/api/auth/forgot-password?username=${encodeURIComponent(data.username)}&email=${encodeURIComponent(data.email)}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Restablece la contraseña usando el token recibido por email
  
  Parámetros: token - Código de verificación, newPassword - Nueva contraseña
  
  Retorna: Response de confirmación del servidor
  */
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post(
        `/api/auth/reset-password?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Guarda el token de autenticación en localStorage
  
  Parámetros: token - Token JWT de autenticación
  
  Retorna: void
  */
  saveToken(token) {
    localStorage.setItem('access_token', token);
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene el token de autenticación desde localStorage
  
  Parámetros: ninguno
  
  Retorna: Token JWT o null si no existe
  */
  getToken() {
    return localStorage.getItem('access_token');
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina el token de autenticación del localStorage
  
  Parámetros: ninguno
  
  Retorna: void
  */
  removeToken() {
    localStorage.removeItem('access_token');
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Guarda los datos del usuario en localStorage
  
  Parámetros: user - Objeto con datos del usuario
  
  Retorna: void
  */
  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene los datos del usuario desde localStorage
  
  Parámetros: ninguno
  
  Retorna: Objeto con datos del usuario o null si no existe
  */
  getUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina los datos del usuario del localStorage
  
  Parámetros: ninguno
  
  Retorna: void
  */
  removeUser() {
    localStorage.removeItem('user');
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Verifica si hay un token de autenticación guardado
  
  Parámetros: ninguno
  
  Retorna: Boolean indicando si el usuario está autenticado
  */
  isAuthenticated() {
    return !!this.getToken();
  }
};