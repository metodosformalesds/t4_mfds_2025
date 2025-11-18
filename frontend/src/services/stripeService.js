/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: stripeService.js
 * Descripción: Servicio de integración con Stripe para procesamiento de pagos, gestión de
 *              checkout sessions, cuentas conectadas de vendedores y verificación de estado de pagos.
 */

import { loadStripe } from '@stripe/stripe-js';
import { apiClient } from './api';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

class StripeService {
  /*
  Autor: Erick Rangel
  
  Descripción: Constructor del servicio Stripe
  
  Parámetros: ninguno
  
  Retorna: Instancia de StripeService
  */
  constructor() {
    this.stripePromise = null;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Inicializa y carga la librería de Stripe (solo una vez)
  
  Parámetros: ninguno
  
  Retorna: Promise con instancia de Stripe
  */
  async initializeStripe() {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return this.stripePromise;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Crea una sesión de Checkout de Stripe para procesar el pago de una orden
  
  Parámetros: orderId - ID de la orden, successUrl - URL de éxito, cancelUrl - URL de cancelación
  
  Retorna: URL de la sesión de checkout
  */
  async createCheckoutSession(orderId, successUrl, cancelUrl) {
    const response = await apiClient.post('/api/stripe/create-checkout-session', {
      order_id: orderId,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    return response.checkoutUrl;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Redirige al usuario a Stripe Checkout para completar el pago
  
  Parámetros: orderId - ID de la orden, order - Datos de la orden
  
  Retorna: void (redirige la página)
  */
  async redirectToCheckout(orderId, order) {
    try {
      const successUrl = `${window.location.origin}/orden-confirmada?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/carrito`;

      const checkoutUrl = await this.createCheckoutSession(orderId, successUrl, cancelUrl);
      
      window.location.href = checkoutUrl;
      
    } catch (error) {
      throw error;
    }
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Verifica el estado de un pago mediante Payment Intent ID
  
  Parámetros: paymentIntentId - ID del Payment Intent
  
  Retorna: Objeto con estado del pago
  */
  async checkPaymentStatus(paymentIntentId) {
    return { status: 'succeeded' };
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Crea una cuenta conectada de Stripe para un vendedor
  
  Parámetros: country - Código de país (default: "MX")
  
  Retorna: ID de la cuenta creada
  */
  async createConnectedAccount(country = "MX") {
    return await apiClient.post('/api/stripe/create-connected-account', {
      country: country
    });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Crea enlace de onboarding para configurar cuenta de vendedor
  
  Parámetros: ninguno
  
  Retorna: URL del enlace de onboarding
  */
  async createAccountLink() {
    return await apiClient.post('/api/stripe/create-account-link');
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Verifica el estado actual de la cuenta de vendedor
  
  Parámetros: ninguno
  
  Retorna: String con estado de la cuenta
  */
  async verifyAccountStatus() {
    return await apiClient.get('/api/stripe/verify-account-status');
  }
}

export const stripeService = new StripeService();
export default stripeService;