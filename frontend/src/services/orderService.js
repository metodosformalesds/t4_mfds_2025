/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: orderService.js
 * Descripción: Servicio para gestión de órdenes incluyendo creación, validación de stock,
 *              preparación de items y cálculo de totales con manejo de envíos y promociones.
 */

import { apiClient } from './api';

class OrderService {
  /**
   * Crear una nueva orden desde el carrito
   * @param {Object} orderData - Datos de la orden
   * @param {string} orderData.address - Dirección de envío
   * @param {Array} orderData.items - Items del carrito
   * @returns {Promise<Object>} Orden creada
   */
  async createOrder(orderData) {
    return await apiClient.post('/api/orders/', orderData);
  }

  /**
   * Obtener una orden por ID
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden
   */
  async getOrder(orderId) {
    return await apiClient.get(`/api/orders/${orderId}`);
  }

  /**
   * Obtener todas las órdenes del usuario actual
   * @returns {Promise<Array>} Lista de órdenes
   */
  async getMyOrders() {
    // El backend expone GET /api/orders/ (con query param `role` opcional).
    // Llamar a `/api/orders/` sin segmento adicional para evitar 422 cuando
    // se intenta resolver una ruta de `/{order_id}` con un string.
    return await apiClient.get('/api/orders/', { role: 'buyer' });
  }

  /**
   * Confirmar (marcar como entregada) una orden del comprador
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden actualizada
   */
  async confirmOrder(orderId) {
    return await apiClient.post(`/api/orders/${orderId}/confirm`);
  }

  /**
   * Validar stock de productos antes de crear orden
   * @param {Array} cartItems - Items del carrito
   * @returns {Promise<boolean>} True si todo el stock es válido
   */
  async validateStock(cartItems) {
    // Validar que todos los productos tengan stock suficiente
    for (const item of cartItems) {
      const product = item.product;
      
      // Verificar disponibilidad
      if (!product.is_available) {
        throw new Error(`El producto "${product.name}" no está disponible`);
      }
      
      // Verificar stock suficiente
      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para "${product.name}". ` +
          `Disponible: ${product.stock}, Solicitado: ${item.quantity}`
        );
      }
    }
    
    return true;
  }

  /**
   * Preparar items para crear orden desde el carrito
   * @param {Array} cartItems - Items del carrito
   * @returns {Array} Items formateados para la orden
   */
  prepareOrderItems(cartItems) {
    return cartItems
      .filter(item => {
        const product = item.product || {};
        // Solo incluir productos disponibles y con stock
        return product.is_available && product.stock >= item.quantity;
      })
      .map(item => {
        const product = item.product;
        return {
          product_id: product.id,
          quantity: item.quantity,
          unit_price: parseFloat(product.price) || 0
        };
      });
  }

/**
 * Calcular totales de la orden
 */
calculateTotals(cartItems) {
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  
  const subtotal = safeCartItems.reduce((total, item) => {
    const product = item.product || {};
    if (product.is_available && product.stock >= item.quantity) {
      return total + (parseFloat(product.price) || 0) * item.quantity;
    }
    return total;
  }, 0);

  // Envío fijo $99, gratis sobre $999
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
}
}

// Instancia global del servicio
export const orderService = new OrderService();
export default orderService;