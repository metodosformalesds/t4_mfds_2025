/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: checkout.jsx
 * Descripción: Página principal de checkout que maneja el flujo de compra incluyendo dirección de envío,
 *              resumen de orden y procesamiento de pago mediante Stripe.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import { useOrder } from '../../hooks/useOrder';
import { userService } from '../../services/userService';
import { Header } from '../../components/Header';
import { Footer } from '../../components/footer';
import { AddressForm } from '../../components/formularios/address';
import { OrderSummary } from '../../components/order';
import { PaymentSection } from '../../components/payment';
import { orderService } from '../../services/orderService';
import './checkout.css';

/**
 * Página principal de checkout
 * Maneja el flujo completo: Dirección → Resumen → Pago
 */
export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totals: cartTotals } = useCartContext();
  const { createOrder, loading: orderLoading, error: orderError, totals: orderTotals } = useOrder();

  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 });
  
  // ESTADOS DEL CHECKOUT
  const [currentStep, setCurrentStep] = useState('address');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');

  // Calcular totals cuando cambie cartItems
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const calculatedTotals = orderService.calculateTotals(cartItems);
      setTotals(calculatedTotals);
    }
  }, [cartItems]);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
        
        const userData = await userService.getCurrentUser();
        setUser(userData);

        if (userData.address) {
          setShippingAddress(userData.address);
        }
        
      } catch (err) {
        console.error('Error loading user data:', err);
        setUserError('Error al cargar los datos del usuario');
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (cartItems.length === 0 && currentStep === 'address') {
      navigate('/carrito');
    }
  }, [cartItems, currentStep, navigate]);

  // Envío del formulario de dirección
  const handleAddressSubmit = async (address) => {
    try {
      setShippingAddress(address);
      
      const newOrder = await createOrder(address, false); 
      setCurrentOrder(newOrder);
      
      setCurrentStep('payment');
      
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  // Volver al paso anterior
  const handleBackToAddress = () => {
    setCurrentStep('address');
    setCurrentOrder(null);
  };

  // Cancelar checkout
  const handleCancelCheckout = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar el checkout?')) {
      navigate('/carrito');
    }
  };

  // Éxito en el pago (callback para PaymentSection)
  const handlePaymentSuccess = async () => {
  try {

    const { clearCart } = useCartContext();
    await clearCart();
    
    console.log('Pago exitoso - Carrito limpiado');
  } catch (error) {
    console.error('Error limpiando carrito después del pago:', error);
  }
};

  // Error en el pago
  const handlePaymentError = (error) => {
    console.error('Error en el proceso de pago:', error);
    // El error se muestra en el PaymentSection
  };

  // Contenido basado en el paso actual
  const renderStepContent = () => {
    // irección de envío
    if (currentStep === 'address') {
      return (
        <div className="checkout-step">
          <div className="step-header">
            <div className="step-indicator active">1</div>
            <h2 className="step-title">Dirección de envío</h2>
          </div>
          
          {userLoading ? (
            <div className="loading-user">
              <div className="loading-spinner"></div>
              <p>Cargando tus datos...</p>
            </div>
          ) : userError ? (
            <div className="user-error">
              <div className="error-icon"></div>
              <div className="error-content">
                <strong>Error al cargar tus datos</strong>
                <p>{userError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="retry-btn"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <AddressForm
              user={user}
              onSubmit={handleAddressSubmit}
              onCancel={handleCancelCheckout}
              loading={orderLoading}
            />
          )}
        </div>
      );
    }

    // Pago
    if (currentStep === 'payment') {
      return (
        <div className="checkout-step">
          <div className="step-header">
            <div className="step-indicator completed">1</div>
            <div className="step-connector"></div>
            <div className="step-indicator active">2</div>
            <h2 className="step-title">Método de pago</h2>
          </div>
          
          <PaymentSection
            order={currentOrder}
            onBack={handleBackToAddress}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
      );
    }

    return null;
  };

  // Banner de error global
  const renderErrorBanner = () => {
    if (orderError) {
      return (
        <div className="global-error-banner">
          <div className="error-content">
            <span>{orderError}</span>
            <button 
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="checkout-page">
      <Header />
      
      <main className="checkout-main">
        <div className="checkout-container">
          
          {/*ERROR GLOBAL */}
          {renderErrorBanner()}
          
          {/* PROGRESO DEL CHECKOUT (Mobile) */}
          <div className="checkout-progress-mobile">
            <div className={`progress-step ${currentStep === 'address' ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Dirección</span>
            </div>
            <div className="progress-connector"></div>
            <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Pago</span>
            </div>
          </div>

          <div className="checkout-content">
            
            {/*CONTENIDO PRINCIPAL */}
            <div className="checkout-steps">
              {renderStepContent()}
            </div>

            {/* RESUMEN DE LA ORDEN */}
            <div className="checkout-sidebar">
              <OrderSummary
                cartItems={cartItems}
                totals={totals}
                showEditButton={currentStep === 'payment'}
                onEditClick={handleBackToAddress}
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};