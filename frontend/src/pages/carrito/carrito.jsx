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
  
  // Estado global del carrito
  const { 
    cartItems, 
    loading, 
    error, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    refetch 
  } = useCartContext();

  //  UI y modales
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  //  Verificar autenticación al cargar
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  //  Recargar carrito cuando se autentica
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  //  Actualizar cantidad de un producto
  const handleQuantityChange = async (productId, newQuantity) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      //  Podríamos mostrar un toast de error aquí
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar item del carrito
  const handleRemoveItem = async (productId) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
      //  Mostrar mensaje al usuario
    } finally {
      setActionLoading(false);
    }
  };

  //Vaciar carrito completo
  const handleClearCart = async () => {
    if (actionLoading || cartItems.length === 0) return;
    
    //  Pedir confirmación antes de vaciar
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres vaciar todo el carrito?'
    );
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Manejar error de vaciado
    } finally {
      setActionLoading(false);
    }
  };

  //  Proceder al checkout
  const handleCheckout = () => {
    // Verificar que hay productos disponibles
    const hasAvailableItems = cartItems.some(item => {
      const product = item.product || {};
      return product.is_available && product.stock > 0;
    });

    if (!hasAvailableItems) {
      alert('No hay productos disponibles para proceder al checkout');
      return;
    }

    // Ir a checkout (vista futura)
    navigate('/checkout');
    console.log('Navegando a checkout...');
  };

  // Cerrar modal de autenticación
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    navigate('/'); // Redirigir al inicio si cierran el modal
  };

  //  Contenido principal de la página
  const renderCartContent = () => {
    // CARRITO VACÍO
    if (cartItems.length === 0 && !loading) {
      return <CartEmpty />;
    }

    // LISTA DE PRODUCTOS
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