/*
  Autor: Erick Rangel
  Fecha 15-11-2025
  Pagina: carrito.jsx
  Descripción:
  Página principal del carrito de compras
  Maneja toda la lógica del carrito y coordinación entre componentes
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CartItem } from '../../components/carrito/CartItem.jsx';
import { CartSummary } from '../../components/carrito/CartSummary.jsx';
import { CartEmpty } from '../../components/carrito/CartEmpty.jsx';
import { AuthModal } from '../../components/modales/auth';
import './carrito.css';

export const Carrito = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { 
    cartItems, 
    loading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    refetch 
  } = useCartContext();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  /*
    Autor: Erick Rangel

    Descripción: 
    Actualiza la cantidad de un producto en el carrito.

    Parámetros:
    productId - number: ID del producto
    newQuantity - number: Nueva cantidad

    Retorna:
    Promise<void>
  */
  const handleQuantityChange = async (productId, newQuantity) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      await updateCartItem(productId, newQuantity);
    } catch (error) {
    } finally {
      setActionLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Elimina un producto del carrito.

    Parámetros:
    productId - number: ID del producto a eliminar

    Retorna:
    Promise<void>
  */
  const handleRemoveItem = async (productId) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      await removeFromCart(productId);
    } catch (error) {
    } finally {
      setActionLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Vacía completamente el carrito después de confirmar con el usuario.

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const handleClearCart = async () => {
    if (actionLoading || cartItems.length === 0) return;
    
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres vaciar todo el carrito?'
    );
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await clearCart();
    } catch (error) {
    } finally {
      setActionLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Navega a la página de checkout si hay productos disponibles.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleCheckout = () => {
    const hasAvailableItems = cartItems.some(item => {
      const product = item.product || {};
      return product.is_available && product.stock > 0;
    });

    if (!hasAvailableItems) {
      alert('No hay productos disponibles para proceder al checkout');
      return;
    }

    navigate('/checkout', { state: { preserveCart: true } });
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Cierra el modal de autenticación y redirige al inicio.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    navigate('/'); // Redirigir al inicio si cierran el modal
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Renderiza el contenido del carrito (items o mensaje de carrito vacío).

    Parámetros:
    Ninguno

    Retorna:
    JSX.Element - Contenido del carrito
  */
  const renderCartContent = () => {
    if (cartItems.length === 0 && !loading) {
      return <CartEmpty />;
    }

    return (
      <div className="cart-content">
        {/* ENCABEZADO DEL CARRITO */}
        <div className="cart-header">
          <h1 className="cart-title">Tu carrito de compras</h1>
          <p className="cart-subtitle">
            {cartItems.length} producto(s) en tu carrito
          </p>
        </div>

        {/* LISTA DE ITEMS */}
        <div className="cart-items-section">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                disabled={actionLoading}
              />
            ))}
          </div>
        </div>

        {/* RESUMEN Y TOTALES */}
        <div className="cart-summary-section">
          <CartSummary
            cartItems={cartItems}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
            disabled={actionLoading}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="cart-page">
      {/* HEADER DE LA APLICACIÓN */}
      <Header />

      {/* CONTENIDO PRINCIPAL */}
      <main className="cart-main">
        <div className="cart-container">
          
          {/* INDICADOR DE CARGA */}
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Cargando tu carrito...</p>
            </div>
          )}

          {/* MENSAJES DE ERROR */}
          {error && (
            <div className="error-banner">
              <div className="error-content">
                <span>⚠️ {error}</span>
                <button 
                  onClick={refetch}
                  className="retry-btn"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* CONTENIDO DEL CARRITO */}
          {!loading && renderCartContent()}
        </div>
      </main>

      {/* FOOTER DE LA APLICACIÓN */}
      <Footer />
    </div>
  );
};