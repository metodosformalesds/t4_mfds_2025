// src/services/cartService.js
import { apiClient } from './api';

class CartService {
  /**
   * Obtener todos los items del carrito del usuario
   * @returns {Promise<Array>} Lista de items del carrito
   */
  async getCart() {
    return await apiClient.get('/api/cart/');
  }

  /**
   * Agregar producto al carrito
   * @param {number} productId - ID del producto
   * @param {number} quantity - Cantidad (default: 1)
   * @returns {Promise<Object>} Item del carrito creado
   */
  async addToCart(productId, quantity = 1) {
    return await apiClient.post('/api/cart/', {
      product_id: productId,
      quantity: quantity
    });
  }

  /**
   * Actualizar cantidad de un producto en el carrito
   * @param {number} productId - ID del producto
   * @param {number} quantity - Nueva cantidad
   * @returns {Promise<Object>} Item del carrito actualizado
   */
  async updateCartItem(productId, quantity) {
    return await apiClient.put(`/api/cart/${productId}`, {
      quantity: quantity
    });
  }

  /**
   * Eliminar producto del carrito
   * @param {number} productId - ID del producto
   * @returns {Promise} Respuesta del servidor
   */
  async removeFromCart(productId) {
    return await apiClient.delete(`/api/cart/${productId}`);
  }

  /**
   * Vaciar carrito completo
   * @returns {Promise} Respuesta del servidor
   */
  async clearCart() {
    return await apiClient.delete('/api/cart/');
  }

  /**
   * Obtener cantidad total de items en el carrito
   * @returns {Promise<number>} Cantidad total
   */
  async getTotalItems() {
    try {
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error getting total items:', error);
      return 0;
    }
  }
}

// Instancia global del servicio
export const cartService = new CartService();
export default cartService;