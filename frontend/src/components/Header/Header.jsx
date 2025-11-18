/*
  Autor: Erick Rangel
  Fecha 11-11-2025
  componente: header.jsx
  Descripción:
  componente básico que muestra logo, links de navegación y botones
  para inicio de sesión, carrito y logout.
*/

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCartContext } from '../../context/CartContext';
import './Header.css';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCartContext();  //usar estado global que actualzia totalItems para reflejar contador del carrito

  /*
    Autor: Erick Rangel

    Descripción: 
    Alterna el estado del menú móvil (abierto/cerrado).
  */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Cierra el menú móvil.
  */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Cierra la sesión del usuario y cierra el menú móvil.
  */
  const handleLogout = () => {
    logout();
    closeMenu();
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Navega a la página del carrito y cierra el menú móvil.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleCartClick = () => {
    navigate('/carrito');
    closeMenu();
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Verifica si la ruta actual coincide con la ruta dada para aplicar estilo activo.

    Parámetros:
    path - string: La ruta a verificar

    Retorna:
    boolean - True si la ruta actual coincide con la ruta dada
  */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="header-logo">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <div className="logo">Re<span className="logo-accent">born</span></div>
          </Link>
        </div>

        {/* BOTÓN HAMBURGUESA*/}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVEGACIÓN PRINCIPAL*/}
        <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {/* LOGIN MÓVIL - Cambia según autenticación */}
            <li className="mobile-login-item">
              {isAuthenticated ? (
                <div className="user-menu-mobile">
                  <Link to="/mi-cuenta" className="mobile-login-link" onClick={closeMenu}>
                    <span className="login-icon"></span>
                    Mi Perfil
                  </Link>
                  {user?.rol === 'artist' && (
                    <Link to="/mi-cuenta/agregar-producto" className="mobile-login-link" onClick={closeMenu}>
                      Agregar Producto
                    </Link>
                  )}
                  {/* CONTADOR CARRITO - MÓVIL */}
                  <button 
                    className="cart-link-mobile"
                    onClick={handleCartClick}
                  >
                    Carrito ({totalItems})
                  </button>
                  <button 
                    className="logout-button-mobile" 
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="mobile-login-link" onClick={closeMenu}>
                  <span className="login-icon"></span>
                  Bienvenido, identifícate
                </Link>
              )}
            </li>
            
            {/* ENLACES DE NAVEGACIÓN */}
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link 
                to="/catalogo" 
                className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Catálogo
              </Link>
            </li>
            <li>
              <Link 
                to="/artistas" 
                className={`nav-link ${isActive('/artistas') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Artistas
              </Link>
            </li>
          </ul>
        </nav>

        {/* ACCIONES DEL HEADER - Cambia según autenticación */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div className="user-menu-desktop">
              <Link to="/mi-cuenta" className="desktop-login-link">
                Mi Perfil
              </Link>
              {user?.rol === 'artist' && (
                <Link to="/mi-cuenta/agregar-producto" className="desktop-login-link" onClick={closeMenu}>
                  Agregar Producto
                </Link>
              )}
              
              {/* CONTADOR CARRITO - DESKTOP */}
              <button 
                className="cart-link-desktop"
                onClick={handleCartClick}
              >
                Carrito ({totalItems})
              </button>
              <button 
                className="logout-button-desktop" 
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link to="/auth" className="desktop-login-link">
              Bienvenido, identifícate
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </header>
  );
};