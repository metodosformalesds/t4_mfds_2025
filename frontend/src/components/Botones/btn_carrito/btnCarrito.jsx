/*
  Autor: Erick Rangel
  Fecha 12-11-2025
  componente: btncarrito.jsx
  Descripción:
  añade items al carrito 
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { AuthModal } from "../../modales/auth";
import { useCartContext } from '../../../context/CartContext.jsx';
import "./btnCarrito.css";

export const BtnCarrito = ({ 
  className, 
  onClick, 
  disabled = false,
  productId, // Para agregar productos desde cards
  showCount = false // Mostrar contador (false en cards, true en header)
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { totalItems, addToCart } = useCartContext();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Manejar click del botón
  const handleClick = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      // Mostrar modal de autenticación si no está logueado
      setShowAuthModal(true);
      return;
    }

    if (productId) {
      // Si tiene productId, agregar al carrito
      try {
        await addToCart(productId, 1);
        if (onClick) onClick(); // Ejecutar callback si existe
      } catch (error) {
        console.error('Error adding to cart:', error);
        // TODO: Mostrar mensaje de error al usuario
      }
    } else {
      console.log("No hay productId")
      if (onClick) onClick();
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <button 
        className={`btn-carrito ${showCount && totalItems > 0 ? 'con-items' : ''} ${className || ""}`}
        onClick={handleClick}
        disabled={disabled}
        type="button"
        aria-label={productId ? "Agregar al carrito" : "Ver carrito de compras"}
      >
        <svg
          className="carrito-icon"
          fill="none"
          height="70"
          viewBox="0 0 70 70"
          width="70"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect className="rect" fill="#FFC400" height="70" rx="15" width="70" />
          <path
            className="path"
            clipRule="evenodd"
            d="M12.2746 10C11.0184 10 10 11.0175 10 12.2727C10 13.5279 11.0184 14.5455 12.2746 14.5455H15.0479L23.1553 46.9475C20.7654 48.0082 19.0986 50.4005 19.0986 53.1818C19.0986 56.9475 22.1538 60 25.9225 60C29.6913 60 32.7465 56.9475 32.7465 53.1818C32.7465 52.385 32.6096 51.62 32.3582 50.9091H42.2334C41.982 51.62 41.8451 52.385 41.8451 53.1818C41.8451 56.9475 44.9002 60 48.669 60C52.4379 60 55.493 56.9475 55.493 53.1818C55.493 49.4161 52.4379 46.3636 48.669 46.3636H27.6985L26.5612 41.8182H48.669C53.3644 41.8182 56.1797 38.8543 57.7419 35.5816C59.2687 32.3834 59.8 28.5612 59.9854 25.7811C60.2434 21.9094 57.0404 19.0909 53.4938 19.0909H20.8746L19.4614 13.443C18.9551 11.4195 17.1355 10 15.0479 10H12.2746ZM48.669 37.2727H25.4239L22.0119 23.6364H53.4938C54.7519 23.6364 55.5073 24.5608 55.4461 25.479C55.2733 28.0732 54.7892 31.2086 53.636 33.6248C52.5182 35.9661 50.9894 37.2727 48.669 37.2727ZM48.669 55.4405C47.4205 55.4405 46.4085 54.4293 46.4085 53.1818C46.4085 51.9343 47.4205 50.9232 48.669 50.9232C49.9176 50.9232 50.9296 51.9343 50.9296 53.1818C50.9296 54.4293 49.9176 55.4405 48.669 55.4405ZM23.6619 53.1818C23.6619 54.4293 24.674 55.4405 25.9225 55.4405C27.1711 55.4405 28.1832 54.4293 28.1832 53.1818C28.1832 51.9343 27.1711 50.9232 25.9225 50.9232C24.674 50.9232 23.6619 51.9343 23.6619 53.1818Z"
            fill="white"
            fillRule="evenodd"
          />
        </svg>

        {/* Contador de items (solo cuando showCount es true) */}
        {showCount && totalItems > 0 && (
          <span className="cart-count-badge">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Modal de autenticación */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
      />
    </>
  );
};