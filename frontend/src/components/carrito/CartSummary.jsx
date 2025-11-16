/*
  Autor: Erick Rangel
  Fecha 15-11-2025
  componente: cartsummary.jsx
  Descripción:
  Componente para mostrar el resumen y totales del carrito
  Calcula automáticamente subtotal, envío y total
*/

import React from 'react';
import { BtnGeneral } from '../Botones/btn_general';
import './CartSummary.css';

export const CartSummary = ({ 
  cartItems, 
  onCheckout, 
  onClearCart,
  disabled = false 
}) => {
  
  // Subtotal de todos los items disponibles
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.product || {};
      // solo incluir productos disponibles y en stock
      if (product.is_available && product.stock > 0) {
        return total + (parseFloat(product.price) || 0) * item.quantity;
      }
      return total;
    }, 0);
  };

  // Costo de envío (ejemplo: gratis sobre $500)
  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50; // Envío gratis sobre $500
  };

  // Total final
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // Verificar si hay productos disponibles para checkout
  const hasAvailableItems = cartItems.some(item => {
    const product = item.product || {};
    return product.is_available && product.stock > 0;
  });

  // Items disponibles vs no disponibles
  const availableItemsCount = cartItems.filter(item => {
    const product = item.product || {};
    return product.is_available && product.stock > 0;
  }).length;

  const unavailableItemsCount = cartItems.length - availableItemsCount;

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const total = calculateTotal();

  return (
    <div className="cart-summary">
      <h3 className="summary-title">Resumen del Pedido</h3>
      
      {/* DESGLOSE DE COSTOS */}
      <div className="summary-breakdown">
        <div className="summary-row">
          <span>Subtotal ({availableItemsCount} productos)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="summary-row">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        {shipping === 0 && subtotal > 0 && (
          <div className="shipping-notice">
            ¡Envío gratis en compras mayores a $500!  
          </div>
        )}
        
        <div className="summary-divider"></div>
        
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* ADVERTENCIAS SOBRE PRODUCTOS */}
      {unavailableItemsCount > 0 && (
        <div className="unavailable-warning">
          {unavailableItemsCount} producto(s) no disponible(s) 
          no se incluirán en el pedido
        </div>
      )}

      {/* BOTONES DE ACCIÓN */}
      <div className="summary-actions">
        <BtnGeneral
          text="Proceder al Checkout"
          color="morado"
          onClick={onCheckout}
          disabled={disabled || !hasAvailableItems}
          className="checkout-btn"
        />
        
        <BtnGeneral
          text="Vaciar Carrito"
          color="amarillo"
          onClick={onClearCart}
          disabled={disabled || cartItems.length === 0}
          className="clear-btn"
        />
      </div>

      <div className="security-notice">
        Pago seguro con Stripe
      </div>
    </div>
  );
};