import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Cerrar menú al hacer clic en un enlace 
	const closeMenu = () => {
		setIsMenuOpen(false);
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

				{/* NAVEGACIÓN PRINCIPAL - Ahora con Links */}
				<nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
					<ul>
						{/* LOGIN MÓVIL */}
						<li className="mobile-login-item">
							<Link to="/login" className="mobile-login-link" onClick={closeMenu}>
								<span className="login-icon"></span>
								Bienvenido, identifícate
							</Link>
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

				{/* ACCIONES DESKTOP - Ahora con Link */}
				<div className="header-actions">
					<Link to="/login" className="desktop-login-link">
						Bienvenido, identifícate
					</Link>
				</div>
			</div>

			{isMenuOpen && (
				<div className="menu-overlay" onClick={closeMenu}></div>
			)}
		</header>
	);
};