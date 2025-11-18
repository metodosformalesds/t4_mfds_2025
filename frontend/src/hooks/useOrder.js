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

/*
Autor: Erick Rangel

Descripción: Hook personalizado para manejar creación y gestión de órdenes

Parámetros: ninguno

Retorna: Objeto con loading, error, currentOrder, createOrder, getOrder, clearError, clearCurrentOrder, cartItems, hasItems, totals
*/
export const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  const { cartItems, clearCart } = useCartContext();

  /*
  Autor: Erick Rangel
  
  Descripción: Valida que el carrito tenga items disponibles con stock
  
  Parámetros: ninguno
  
  Retorna: Array de items disponibles
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

  /*
  Autor: Erick Rangel
  
  Descripción: Crea una nueva orden desde el carrito actual
  
  Parámetros: shippingAddress - Dirección de envío, clearCartAfter - Si debe limpiar carrito después
  
  Retorna: Promise con orden creada
  */
  const createOrder = useCallback(async (shippingAddress, clearCartAfter = false) => {
    try {
      setLoading(true);
      setError(null);

      const availableItems = validateCart();
      await orderService.validateStock(availableItems);

      const orderItems = orderService.prepareOrderItems(availableItems);
      
      if (orderItems.length === 0) {
        throw new Error('No hay items válidos para crear la orden');
      }

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
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartItems, validateCart, clearCart]);

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene una orden específica por su ID
  
  Parámetros: orderId - ID de la orden
  
  Retorna: Promise con datos de la orden
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Limpia el error actual
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Limpia la orden actual del estado
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    loading,
    error,
    currentOrder,
    createOrder,
    getOrder,
    clearError,
    clearCurrentOrder,
    cartItems,
    hasItems: cartItems && cartItems.length > 0,
    totals: orderService.calculateTotals(cartItems || [])
  };
};

export default useOrder;