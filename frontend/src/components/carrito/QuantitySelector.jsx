/*
  Autor: Erick Rangel
  Fecha 15-11-2025
  componente: quantityselector.jsx
  Descripción:
  Componente para seleccionar cantidad con controles
  Maneja validación de stock y emite eventos de cambio
*/

import React from 'react';
import './QuantitySelector.css';

export const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  maxStock = 99,
  disabled = false 
}) => {
  
  /*
    Autor: Erick Rangel

    Descripción: 
    Valida que la cantidad esté dentro del rango permitido (1 a maxStock).

    Parámetros:
    newQuantity - number: La cantidad a validar

    Retorna:
    number - La cantidad validada
  */
  const validateQuantity = (newQuantity) => {
    if (newQuantity < 1) return 1;
    if (newQuantity > maxStock) return maxStock;
    return newQuantity;
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Incrementa la cantidad del producto en 1 si no se excede el stock máximo.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleIncrement = () => {
    if (quantity < maxStock) {
      const newQuantity = validateQuantity(quantity + 1);
      onQuantityChange(newQuantity);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Decrementa la cantidad del producto en 1 si no se alcanza el mínimo (1).

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = validateQuantity(quantity - 1);
      onQuantityChange(newQuantity);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el cambio directo en el input de cantidad, validando el valor ingresado.

    Parámetros:
    e - Event: Evento del input

    Retorna:
    void
  */
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const newQuantity = validateQuantity(value);
    onQuantityChange(newQuantity);
  };

  return (
    <div className={`quantity-selector ${disabled ? 'disabled' : ''}`}>
      {/* BOTÓN DECREMENTAR - Deshabilitado cuando llega al mínimo */}
      <button
        className="quantity-btn decrement"
        onClick={handleDecrement}
        disabled={quantity <= 1 || disabled}
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      
      {/* INPUT DE CANTIDAD - Controlado y validado */}
      <input
        type="number"
        className="quantity-input"
        value={quantity}
        onChange={handleInputChange}
        min="1"
        max={maxStock}
        disabled={disabled}
        aria-label="Cantidad del producto"
      />
      
      {/* BOTÓN INCREMENTAR - Deshabilitado cuando llega al stock máximo */}
      <button
        className="quantity-btn increment"
        onClick={handleIncrement}
        disabled={quantity >= maxStock || disabled}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  );
};