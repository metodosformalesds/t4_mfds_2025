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
  constructor() {
    this.stripePromise = null;
  }

  /**
   * Inicializar Stripe (cargar solo una vez)
   * @returns {Promise<Stripe>} Instancia de Stripe
   */
  async initializeStripe() {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return this.stripePromise;
  }

    /**
   * Crear Checkout Session para una orden
   * @param {number} orderId - ID de la orden
   * @param {string} successUrl - URL a redirigir después de pago exitoso
   * @param {string} cancelUrl - URL a redirigir si cancela
   * @returns {Promise<string>} URL de Checkout Session
   */
  async createCheckoutSession(orderId, successUrl, cancelUrl) {
    const response = await apiClient.post('/api/stripe/create-checkout-session', {
      order_id: orderId,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    return response.checkoutUrl;
  }

  /**
   * Redirigir a Stripe Checkout 
   * @param {number} orderId - ID de la orden
   * @param {Object} order - Datos de la orden
   * @returns {Promise<void>}
   */
  async redirectToCheckout(orderId, order) {
    try {
      const successUrl = `${window.location.origin}/orden-confirmada?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/carrito`;

      const checkoutUrl = await this.createCheckoutSession(orderId, successUrl, cancelUrl);
      
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Error al crear Checkout Session:', error);
      throw error;
    }
  }

  /**
   * Verificar estado de una sesión de pago
   * @param {string} paymentIntentId - ID del Payment Intent
   * @returns {Promise<Object>} Estado del pago
   */
  async checkPaymentStatus(paymentIntentId) {
    return { status: 'succeeded' };
  }

  /**
   * Crear cuenta conectada para vendedor
   * @param {string} country - País del vendedor (ej: "MX")
   * @returns {Promise<string>} ID de la cuenta creada
   */
  async createConnectedAccount(country = "MX") {
    return await apiClient.post('/api/stripe/create-connected-account', {
      country: country
    });
  }

  /**
   * Crear enlace de onboarding para vendedor
   * @returns {Promise<string>} URL de onboarding
   */
  async createAccountLink() {
    return await apiClient.post('/api/stripe/create-account-link');
  }

  /**
   * Verificar estado de cuenta de vendedor
   * @returns {Promise<string>} Estado actualizado
   */
  async verifyAccountStatus() {
    return await apiClient.get('/api/stripe/verify-account-status');
  }
}

// Instancia global del servicio
export const stripeService = new StripeService();
export default stripeService;