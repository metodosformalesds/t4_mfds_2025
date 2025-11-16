/*
  Autor: Erick Rangel
  Fecha 15-11-2025
  componente: cartempty.jsx
  Descripción:
  Componente para mostrar cuando el carrito está vacío
  Ofrece opciones para continuar comprando
*/

import React from 'react';
import { BtnGeneral } from '../Botones/btn_general';
import { useNavigate } from 'react-router-dom';
import './CartEmpty.css';

export const CartEmpty = () => {
  const navigate = useNavigate();

  // Redirigir al catálogo
  const handleBrowseCatalog = () => {
    navigate('/catalogo');
  };

  // Redirigir al inicio
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="cart-empty">
      {/* ICONO ILUSTRATIVO */}
      <div className="empty-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path 
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.4 5.2 16.4H17M17 13V16.4M9 19C9 19.6 8.6 20 8 20C7.4 20 7 19.6 7 19C7 18.4 7.4 18 8 18C8.6 18 9 18.4 9 19ZM17 19C17 19.6 16.6 20 16 20C15.4 20 15 19.6 15 19C15 18.4 15.4 18 16 18C16.6 18 17 18.4 17 19Z" 
            stroke="#8c00ff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* MENSAJE PRINCIPAL */}
      <h2 className="empty-title">Tu carrito está vacío</h2>
      <p className="empty-message">
        Parece que no has agregado ningún producto a tu carrito. 
        ¡Explora nuestro catálogo y descubre artesanías únicas!
      </p>

      {/* BOTONES DE ACCIÓN */}
      <div className="empty-actions">
        <BtnGeneral
          text="Explorar Catálogo"
          color="morado"
          onClick={handleBrowseCatalog}
          className="browse-btn"
        />
        
        <BtnGeneral
          text="Volver al Inicio"
          color="amarillo"
          onClick={handleGoHome}
          className="home-btn"
        />
      </div>

      {/* SUGERENCIAS */}
      <div className="empty-suggestions">
        <h4>¿Necesitas inspiración?</h4>
        <ul>
          <li>Artesanías hechas a mano</li>
          <li>Materiales únicos para tus proyectos</li>
          <li>Productos de artistas locales</li>
        </ul>
      </div>
    </div>
  );
};