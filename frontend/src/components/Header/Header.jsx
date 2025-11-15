/* 
  Autor: Erick Rangel
  Fecha: 11 de noviembre de 205
  Componente: header
  Descripción: 
  
  muestra logo, links de navegación y autenticación
  se exporta a otros lados del código usando index.js
*/

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();
	const { user, isAuthenticated, logout } = useAuth();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Cerrar menú al hacer clic en un enlace 
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	// Función para manejar logout
	const handleLogout = () => {
		logout();
		closeMenu();
	};

	// Función para verificar si la ruta está activa
	const isActive = (path) => {
		return location.pathname === path;
	};

	return (
		<header className="header">
			<div className="header-container">
				{/* LOGO - Ahora es un Link */}
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
								// Usuario logueado - móvil
								<div className="user-menu-mobile">
									<Link to="/perfil" className="mobile-login-link" onClick={closeMenu}>
										<span className="login-icon"></span>
										Mi Perfil
									</Link>
									<button 
										className="logout-button-mobile" 
										onClick={handleLogout}
									>
										Cerrar Sesión
									</button>
								</div>
							) : (
								// Usuario no logueado - móvil
								<Link to="/auth" className="mobile-login-link" onClick={closeMenu}>
									<span className="login-icon"></span>
									Bienvenido, identifícate
								</Link>
							)}
						</li>
						
						{/* ENLACES DE NAVEGACIÓN - Ahora con Links y estado activo */}
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
						<li>
							<Link 
								to="/categorias" 
								className={`nav-link ${isActive('/categorias') ? 'active' : ''}`}
								onClick={closeMenu}
							>
								Categorías
							</Link>
						</li>
					</ul>
				</nav>

				{/* ACCIONES DEL HEADER - Cambia según autenticación */}
				<div className="header-actions">
					{isAuthenticated ? (
						// Usuario logueado - desktop
						<div className="user-menu-desktop">
							<Link to="/perfil" className="desktop-login-link">
								Mi Perfil
							</Link>
							<button 
								className="logout-button-desktop" 
								onClick={handleLogout}
							>
								Cerrar Sesión
							</button>
						</div>
					) : (
						// Usuario no logueado - desktop
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