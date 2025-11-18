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
import { orderService } from '../services/orderService';

/*
Autor: Erick Rangel

Descripción: Hook personalizado para manejar el estado del carrito (solo funciona autenticado)

Parámetros: ninguno

Retorna: Objeto con cartItems, loading, error, totalItems, totals, addToCart, updateCartItem, removeFromCart, clearCart, refetch, isEmpty, hasError, isAuthenticated, totalPrice
*/
export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  
  const { isAuthenticated } = useAuth();

  /*
  Autor: Erick Rangel
  
  Descripción: Carga los items del carrito desde el backend (solo si está autenticado)
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const fetchCart = useCallback(async () => {
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
      
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(total);
      
    } catch (err) {
      setError(err.message || 'Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /*
  Autor: Erick Rangel
  
  Descripción: Agrega un producto al carrito
  
  Parámetros: productId - ID del producto, quantity - Cantidad (default: 1)
  
  Retorna: void
  */
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      await cartService.addToCart(productId, quantity);
      
      await fetchCart();
      
    } catch (err) {
      setError(err.message || 'Error al agregar al carrito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /*
  Autor: Erick Rangel
  
  Descripción: Actualiza la cantidad de un producto en el carrito
  
  Parámetros: productId - ID del producto, quantity - Nueva cantidad
  
  Retorna: void
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina un producto del carrito
  
  Parámetros: productId - ID del producto
  
  Retorna: void
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  /*
  Autor: Erick Rangel
  
  Descripción: Vacía todo el carrito del usuario
  
  Parámetros: ninguno
  
  Retorna: void
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
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    loading,
    error,
    totalItems,
    totals: orderService.calculateTotals(cartItems),
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
    isEmpty: cartItems.length === 0 && !loading,
    hasError: !!error,
    isAuthenticated, 
    totalPrice: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
  };
};

export default useCart;