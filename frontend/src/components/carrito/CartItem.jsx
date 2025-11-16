/*
  Autor: Erick Rangel
  Fecha 15-11-2025
  componente: cartitem.jsx
  Descripción:
  Componente para mostrar un item individual del carrito
  Maneja actualización de cantidades y eliminación
*/

import React, { useState } from 'react';
import { QuantitySelector } from './QuantitySelector';
import { BtnGeneral } from '../Botones/btn_general';
import './CartItem.css';


export const CartItem = ({ 
  item, 
  onQuantityChange, 
  onRemove,
  disabled = false 
}) => {
  const [updating, setUpdating] = useState(false);
  
  // DATOS DEL PRODUCTO - Extraer con valores por defecto para evitar errores
  const product = item.product || {};
  const productId = product.id;
  const productName = product.name || 'Producto no disponible';
  const productPrice = parseFloat(product.price) || 0;
  const productStock = product.stock || 0;
  const productImage = product.images?.[0] || '/placeholder-image.jpg';
  const isAvailable = product.is_available && productStock > 0;

  // Actualizar cantidad con estado de carga
  const handleQuantityUpdate = async (newQuantity) => {
    if (disabled || updating) return;
    
    try {
      setUpdating(true);
      await onQuantityChange(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Eliminar item del carrito
  const handleRemove = async () => {
    if (disabled) return;
    
    try {
      await onRemove(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Subtotal por item
  const itemSubtotal = productPrice * item.quantity;

  return (
    <div className={`cart-item ${!isAvailable ? 'unavailable' : ''} ${updating ? 'updating' : ''}`}>
      
      {/* IMAGEN DEL PRODUCTO */}
      <div className="cart-item-image">
        <img 
          src={productImage} 
          alt={productName}
          onError={(e) => {
            // Si la imagen falla, usar placeholder
            e.target.src = 'https://placehold.co/600x400';
          }}
        />
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="cart-item-info">
        <h3 className="product-name">{productName}</h3>
        
        {/* PRECIO UNITARIO */}
        <p className="product-price">${productPrice.toFixed(2)} c/u</p>
        
        {/* ESTADO DE DISPONIBILIDAD */}
        {!isAvailable && (
          <div className="availability-warning">
            Producto no disponible
          </div>
        )}
        
        {/* STOCK DISPONIBLE */}
        {isAvailable && productStock < 10 && (
          <div className="stock-warning">
            Solo {productStock} disponibles
          </div>
        )}
      </div>

      {/* CONTROLES DE CANTIDAD */}
      <div className="cart-item-controls">
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={handleQuantityUpdate}
          maxStock={productStock}
          disabled={disabled || !isAvailable || updating}
        />
        
        {/* SUBTOTAL DEL ITEM */}
        <div className="item-subtotal">
          ${itemSubtotal.toFixed(2)}
        </div>
      </div>

      {/* BOTÓN ELIMINAR */}
      <div className="cart-item-actions">
        <BtnGeneral
          text="Eliminar"
          color="rosa"
          onClick={handleRemove}
          disabled={disabled || updating}
          className="remove-btn"
        />
      </div>

      {/* OVERLAY DE CARGA */}
      {updating && <div className="updating-overlay">Actualizando...</div>}
    </div>
  );
};