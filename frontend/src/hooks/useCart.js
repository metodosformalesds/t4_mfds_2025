/* 
  Autor: Erick Rangel
  hook: useCart.js
  fecha: 15-11-2025
  descripcion:
  - Cargar el carrito desde el backend cuando el usuario está autenticado
  - Agregar productos al carrito, actualizar cantidades y eliminar items
  - Vaciar el carrito completo
  - Manejar estados de carga y error
  - Calcular cantidad total de productos y precio total del carrito
  - Limpiar el carrito automáticamente cuando el usuario no está autenticado
  - Exponer utilidades como `isEmpty`, `hasError` y `refetch`
*/


import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para manejar el estado del carrito
 * Solo funciona cuando el usuario está autenticado
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  
  const { isAuthenticated } = useAuth();

  /**
   * Cargar items del carrito (solo si está autenticado)
   */
  const fetchCart = useCallback(async () => {
    // Si no está autenticado, limpiar el carrito
    if (!isAuthenticated) {
      setCartItems([]);
      setTotalItems(0);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const items = await cartService.getCart();
      setCartItems(items);
      
      // Calcular total de items
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(total);
      
    } catch (err) {
      setError(err.message || 'Error al cargar el carrito');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Agregar producto al carrito
   */
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      await cartService.addToCart(productId, quantity);
      
      // Recargar carrito después de agregar
      await fetchCart();
      
    } catch (err) {
      setError(err.message || 'Error al agregar al carrito');
      console.error('Error adding to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]); 

  /**
   * Actualizar cantidad en el carrito 
   */
  const updateCartItem = useCallback(async (productId, quantity) => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      await cartService.updateCartItem(productId, quantity);
      await fetchCart();
      
    } catch (err) {
      setError(err.message || 'Error al actualizar el carrito');
      console.error('Error updating cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /**
   * Eliminar producto del carrito
   */
  const removeFromCart = useCallback(async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      await cartService.removeFromCart(productId);
      await fetchCart();
      
    } catch (err) {
      setError(err.message || 'Error al eliminar del carrito');
      console.error('Error removing from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /**
   * Vaciar carrito completo
   */
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      await cartService.clearCart();
      await fetchCart();
      
    } catch (err) {
      setError(err.message || 'Error al vaciar el carrito');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  // Cargar carrito solo cuando cambie el estado de autenticación
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    // Estado
    cartItems,
    loading,
    error,
    totalItems,
    
    // Acciones 
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    
    // Utilidades
    isEmpty: cartItems.length === 0 && !loading,
    hasError: !!error,
    isAuthenticated, 
    totalPrice: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
  };
};

export default useCart;