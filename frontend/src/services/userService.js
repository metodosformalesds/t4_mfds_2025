/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: userService.js
 * Descripción: Servicio para gestionar datos del usuario, incluyendo obtención de datos actuales,
 *              actualización de perfil, validación de direcciones y preparación de datos de envío.
 */

import { apiClient } from './api';

class UserService {
  /**
   * Obtener datos del usuario actual
   * @returns {Promise<Object>} Datos del usuario
   */
  async getCurrentUser() {
    return await apiClient.get('/api/users/me');
  }

  /**
   * Actualizar datos del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateUser(userData) {
    return await apiClient.put('/api/users/me', userData);
  }

  /**
   * Verificar si el usuario tiene dirección completa
   * @param {Object} user - Datos del usuario
   * @returns {boolean} True si tiene dirección válida
   */
  hasCompleteAddress(user) {
    return user && user.address && user.address.trim().length > 0;
  }

  /**
   * Preparar datos de envío desde el usuario
   * @param {Object} user - Datos del usuario
   * @param {string} customAddress - Dirección personalizada (opcional)
   * @returns {Object} Datos de envío formateados
   */
  prepareShippingData(user, customAddress = '') {
    const address = customAddress || user.address || '';
    
    if (!address.trim()) {
      throw new Error('La dirección de envío es requerida');
    }

    return {
      address: address.trim(),
      customer_name: user.full_name || '',
      customer_email: user.email || '',
      customer_phone: user.phone || ''
    };
  }
}

// Instancia global del servicio
export const userService = new UserService();
export default userService;