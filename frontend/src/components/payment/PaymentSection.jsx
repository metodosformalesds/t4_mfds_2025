/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: PaymentSection.jsx
 * Descripción: Componente para procesar pagos con Stripe Checkout, maneja la redirección segura
 *              a Stripe y la gestión de estados de carga y errores durante el pago.
 */

import React, { useState } from 'react';
import { BtnGeneral } from '../Botones/btn_general';
import { stripeService } from '../../services/stripeService';
import './PaymentSection.css';

export const PaymentSection = ({ 
  order, 
  onBack, 
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  /*
    Autor: Erick Rangel

    Descripción: 
    Procesa el pago redirigiendo a Stripe Checkout.

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      if (!order || !order.id) {
        throw new Error('No hay una orden válida para procesar el pago');
      }

            
      await stripeService.redirectToCheckout(order.id, order);
      
      
    } catch (err) {
            setError(err.message || 'Error al procesar el pago');
      if (onPaymentError) onPaymentError(err);
    } finally {
      setProcessing(false);
    }
  };

  const platformFee = order ? (order.platform_fee || order.total_amount * 0.05) : 0;
  const sellerAmount = order ? (order.seller_amount || order.total_amount - platformFee) : 0;

  return (
    <div className="payment-section">
      <div className="payment-header">
        <h3 className="payment-title">Método de pago</h3>
      </div>

      {/*INFORMACIÓN DE STRIPE */}
      <div className="stripe-info">
        <div className="stripe-logo">
          <div className="stripe-text">Stripe</div>
        </div>
        <p className="stripe-description">
          Serás redirigido a Stripe Checkout para completar tu pago de forma segura.
          Stripe procesa tu información de pago de manera cifrada.
        </p>
      </div>

      {/* MENSAJES DE ERROR */}
      {error && (
        <div className="payment-error">
          <div className="error-icon"></div>
          <div className="error-content">
            <strong>Error en el pago</strong>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="dismiss-error"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* BOTONES DE ACCIÓN */}
      <div className="payment-actions">
        <BtnGeneral
          text="Volver atrás"
          color="amarillo"
          onClick={onBack}
          disabled={processing}
          className="back-btn"
        />
        
        <BtnGeneral
          text={processing ? "Procesando..." : "Pagar con Stripe"}
          color="morado"
          onClick={handlePayment}
          disabled={processing || !order}
          className="pay-btn"
        />
      </div>

      {/* OVERLAY DE PROCESAMIENTO */}
      {processing && (
        <div className="processing-overlay">
          <div className="processing-spinner"></div>
          <p>Redirigiendo a Stripe Checkout...</p>
          <p className="processing-note">
            No cierres esta ventana hasta completar el pago
          </p>
        </div>
      )}
    </div>
  );
};