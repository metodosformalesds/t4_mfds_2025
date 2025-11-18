/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: OrderSummary.jsx
 * Descripción: Componente que muestra el resumen detallado de la orden incluyendo productos,
 *              precios unitarios, envío, totales y notificación de productos no disponibles.
 */

import React from 'react';
import './OrderSummary.css';

export const OrderSummary = ({ 
  cartItems = [], 
  totals = {},
  showEditButton = false,
  onEditClick 
}) => {
  
  const safeTotals = {
    subtotal: totals?.subtotal || 0,
    shipping: totals?.shipping || 0,
    total: totals?.total || 0
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const availableItems = safeCartItems.filter(item => {
    const product = item.product || {};
    return product.is_available && product.stock >= item.quantity;
  });

  const unavailableItems = safeCartItems.filter(item => {
    const product = item.product || {};
    return !product.is_available || product.stock < item.quantity;
  });

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h3 className="summary-title">Resumen de tu orden</h3>
        {showEditButton && (
          <button 
            className="edit-button"
            onClick={onEditClick}
          >
            Editar
          </button>
        )}
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="products-section">
        <h4 className="section-title">Productos ({availableItems.length})</h4>
        
        <div className="products-list">
          {availableItems.map((item) => {
            const product = item.product || {};
            const itemTotal = (parseFloat(product.price) || 0) * item.quantity;
            
            return (
              <div key={item.id} className="product-item">
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="product-details">
                  <h5 className="product-name">{product.name}</h5>
                  <p className="product-seller">
                    por {product.user?.full_name || 'Artista'}
                  </p>
                  <div className="product-meta">
                    <span className="product-price">${parseFloat(product.price).toFixed(2)} c/u</span>
                    <span className="product-quantity">x {item.quantity}</span>
                  </div>
                </div>
                
                <div className="product-total">
                  ${itemTotal.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RODUCTOS NO DISPONIBLES */}
      {unavailableItems.length > 0 && (
        <div className="unavailable-section">
          <h4 className="section-title unavailable-title">
            Productos no disponibles ({unavailableItems.length})
          </h4>
          
          <div className="unavailable-list">
            {unavailableItems.map((item) => {
              const product = item.product || {};
              const reason = !product.is_available ? 
                'Producto no disponible' : 
                `Stock insuficiente (${product.stock} disponibles)`;
              
              return (
                <div key={item.id} className="unavailable-item">
                  <span className="unavailable-name">{product.name}</span>
                  <span className="unavailable-reason">{reason}</span>
                </div>
              );
            })}
          </div>
          
          <div className="unavailable-notice">
            Estos productos no se incluirán en tu orden
          </div>
        </div>
      )}

      {/* DESGLOSE DE PRECIOS */}
      <div className="pricing-section">
        <div className="pricing-row">
          <span>Subtotal</span>
          <span>${safeTotals.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="pricing-row">
          <span>Envío</span>
          <span className={safeTotals.shipping === 0 ? 'free-shipping' : ''}>
            {safeTotals.shipping === 0 ? 'Gratis' : `$${safeTotals.shipping.toFixed(2)}`}
          </span>
        </div>
        
        {safeTotals.shipping === 0 && safeTotals.subtotal > 0 && (
          <div className="shipping-notice">
            ¡Envío gratis en compras mayores a $999!
          </div>
        )}
        
        <div className="pricing-divider"></div>
        
        <div className="pricing-row total">
          <span>Total</span>
          <span>${safeTotals.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};