/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: orderService.js
 * Descripción: Servicio para gestión de órdenes incluyendo creación, validación de stock,
 *              preparación de items y cálculo de totales con manejo de envíos y promociones.
 */

import { apiClient } from './api';

class OrderService {
  /*
  Autor: Erick Rangel
  
  Descripción: Crea una nueva orden desde el carrito del usuario
  
  Parámetros: orderData - Objeto con address e items de la orden
  
  Retorna: Orden creada con ID y detalles
  */
  async createOrder(orderData) {
    return await apiClient.post('/api/orders/', orderData);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene una orden específica por su ID
  
  Parámetros: orderId - ID de la orden
  
  Retorna: Objeto con detalles de la orden
  */
  async getOrder(orderId) {
    return await apiClient.get(`/api/orders/${orderId}`);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todas las órdenes del usuario actual como comprador
  
  Parámetros: ninguno
  
  Retorna: Array de órdenes del usuario
  */
  async getMyOrders() {
    return await apiClient.get('/api/orders/', { role: 'buyer' });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Marca una orden como entregada/confirmada por el comprador
  
  Parámetros: orderId - ID de la orden a confirmar
  
  Retorna: Orden actualizada
  */
  async confirmOrder(orderId) {
    return await apiClient.post(`/api/orders/${orderId}/confirm`);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Valida que todos los productos tengan stock suficiente antes de crear orden
  
  Parámetros: cartItems - Array de items del carrito
  
  Retorna: Boolean true si todo es válido, throw Error si hay problemas
  */
  async validateStock(cartItems) {
    for (const item of cartItems) {
      const product = item.product;
      
      if (!product.is_available) {
        throw new Error(`El producto "${product.name}" no está disponible`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para "${product.name}". ` +
          `Disponible: ${product.stock}, Solicitado: ${item.quantity}`
        );
      }
    }
    
    return true;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Prepara los items del carrito para crear una orden filtrando disponibles
  
  Parámetros: cartItems - Array de items del carrito
  
  Retorna: Array de items formateados con product_id, quantity y unit_price
  */
  prepareOrderItems(cartItems) {
    return cartItems
      .filter(item => {
        const product = item.product || {};
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

  /*
  Autor: Erick Rangel
  
  Descripción: Calcula subtotal, costo de envío y total de la orden
  
  Parámetros: cartItems - Array de items del carrito
  
  Retorna: Objeto con subtotal, shipping y total
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

    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }
}

export const orderService = new OrderService();
export default orderService;