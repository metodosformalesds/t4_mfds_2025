/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: userService.js
 * Descripción: Servicio para gestionar datos del usuario, incluyendo obtención de datos actuales,
 *              actualización de perfil, validación de direcciones y preparación de datos de envío.
 */

import { apiClient } from './api';

class UserService {
  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene los datos del usuario actualmente autenticado
  
  Parámetros: ninguno
  
  Retorna: Objeto con datos del usuario
  */
  async getCurrentUser() {
    return await apiClient.get('/api/users/me');
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Actualiza los datos del usuario autenticado
  
  Parámetros: userData - Objeto con campos a actualizar
  
  Retorna: Usuario actualizado
  */
  async updateUser(userData) {
    return await apiClient.put('/api/users/me', userData);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Verifica si el usuario tiene dirección completa configurada
  
  Parámetros: user - Objeto con datos del usuario
  
  Retorna: Boolean indicando si tiene dirección válida
  */
  hasCompleteAddress(user) {
    return user && user.address && user.address.trim().length > 0;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Prepara los datos de envío desde el usuario o dirección personalizada
  
  Parámetros: user - Datos del usuario, customAddress - Dirección personalizada opcional
  
  Retorna: Objeto con datos de envío formateados
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

export const userService = new UserService();
export default userService;