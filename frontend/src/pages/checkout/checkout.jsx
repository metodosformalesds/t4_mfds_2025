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

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totals: cartTotals } = useCartContext();
  const { createOrder, loading: orderLoading, error: orderError, totals: orderTotals } = useOrder();

  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 });
  
  const [currentStep, setCurrentStep] = useState('address');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const calculatedTotals = orderService.calculateTotals(cartItems);
      setTotals(calculatedTotals);
    }
  }, [cartItems]);

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
                setUserError('Error al cargar los datos del usuario');
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && currentStep === 'address') {
      navigate('/carrito');
    }
  }, [cartItems, currentStep, navigate]);

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de dirección, crea la orden y avanza al pago.

    Parámetros:
    address - string: Dirección de envío

    Retorna:
    Promise<void>
  */
  const handleAddressSubmit = async (address) => {
    try {
      setShippingAddress(address);
      
      const newOrder = await createOrder(address, false); 
      setCurrentOrder(newOrder);
      
      setCurrentStep('payment');
      
    } catch (err) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Regresa al paso de captura de dirección desde el paso de pago.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleBackToAddress = () => {
    setCurrentStep('address');
    setCurrentOrder(null);
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Cancela el proceso de checkout y regresa al carrito.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleCancelCheckout = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar el checkout?')) {
      navigate('/carrito');
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el éxito del pago. (Funcionalidad pendiente de implementar)

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const handlePaymentSuccess = async () => {
  try {

    const { clearCart } = useCartContext();
    await clearCart();
    
      } catch (error) {
      }
};

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja errores en el proceso de pago. (Funcionalidad pendiente de implementar)

    Parámetros:
    error - Error: El error ocurrido

    Retorna:
    void
  */
  const handlePaymentError = (error) => {
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Renderiza el contenido del paso actual del checkout (dirección o pago).

    Parámetros:
    Ninguno

    Retorna:
    JSX.Element - Contenido del paso actual
  */
  const renderStepContent = () => {
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

  /*
    Autor: Erick Rangel

    Descripción: 
    Renderiza un banner de error global si hay errores en la orden.

    Parámetros:
    Ninguno

    Retorna:
    JSX.Element|null - Banner de error o null
  */
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