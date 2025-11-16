/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: useOrder.js
 * Descripción: Hook personalizado para gestionar la creación y obtención de órdenes, validación de stock,
 *              preparación de items y manejo de estados durante el proceso de compra.
 */

import { useState, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { useCartContext } from '../context/CartContext';

/**
 * Hook personalizado para manejar la creación y gestión de órdenes
 */
export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const { cartItems, clearCart } = useCartContext();

  /**
   * Validar que el carrito tenga items disponibles
   */
  const validateCart = useCallback(() => {
    if (!cartItems || cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const availableItems = cartItems.filter(item => {
      const product = item.product || {};
      return product.is_available && product.stock >= item.quantity;
    });

    if (availableItems.length === 0) {
      throw new Error('No hay productos disponibles en el carrito');
    }

    return availableItems;
  }, [cartItems]);

  /**
   * Crear una nueva orden desde el carrito
   * @param {string} shippingAddress - Dirección de envío
   * @param {boolean} clearCartAfter - Si debe limpiar el carrito después (default: false)
   * @returns {Promise<Object>} Orden creada
   */
  const createOrder = useCallback(async (shippingAddress, clearCartAfter = false) => {
    try {
      setLoading(true);
      setError(null);

      // 🔍 Validar carrito y stock
      const availableItems = validateCart();
      await orderService.validateStock(availableItems);

      // 📦 Preparar items para la orden
      const orderItems = orderService.prepareOrderItems(availableItems);
      
      if (orderItems.length === 0) {
        throw new Error('No hay items válidos para crear la orden');
      }

      // Crear orden en el backend
      const orderData = {
        address: shippingAddress,
        items: orderItems
      };

      const newOrder = await orderService.createOrder(orderData);

      if (clearCartAfter) {
        await clearCart();
      }

      return newOrder;

    } catch (err) {
      setError(err.message || 'Error al crear la orden');
      console.error('Error creating order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartItems, validateCart, clearCart]);

  /**
   * Obtener una orden por ID
   * @param {number} orderId - ID de la orden
   * @returns {Promise<Object>} Orden
   */
  const getOrder = useCallback(async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const order = await orderService.getOrder(orderId);
      setCurrentOrder(order);
      return order;
      
    } catch (err) {
      setError(err.message || 'Error al obtener la orden');
      console.error('Error fetching order:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar orden actual
   */
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    // Estado
    loading,
    error,
    currentOrder,
    
    // Acciones
    createOrder,
    getOrder,
    clearError,
    clearCurrentOrder,
    
    // Utilidades
    cartItems,
    hasItems: cartItems && cartItems.length > 0,
    totals: orderService.calculateTotals(cartItems || [])
  };
};

export default useOrder;