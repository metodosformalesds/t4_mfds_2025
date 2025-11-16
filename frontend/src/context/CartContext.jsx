/* 
  Autor: Erick Rangel
  Fecha: 15-11-2025
  Context: CartContext.jsx
  Descripción:
  Contexto global para el carrito de compras.
  Funcionalidades principales:
  - Proveer acceso al estado y acciones del carrito en toda la aplicación
  - Encapsular el hook `useCart` dentro de un proveedor de contexto
  - Permitir que cualquier componente obtenga el carrito usando `useCartContext`
*/

import { createContext, useContext } from 'react';
import useCart from '../hooks/useCart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const cart = useCart(); 
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);