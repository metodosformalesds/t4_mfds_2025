import React, { useState } from 'react';
import './Header.css';

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Cerrar menú al hacer clic en un enlace 
	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<header className="header">
			<div className="header-container">
				{/* LOGO */}
				<div className="header-logo">
					<div className="logo">Re<span className="logo-accent">born</span></div>
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

				{/* NAVEGACIÓN PRINCIPAL */}
				<nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
					<ul>
						{/* LOGIN MÓVIL */}
						<li className="mobile-login-item">
							<a href="/login" className="mobile-login-link" onClick={closeMenu}>
								<span className="login-icon">👤</span>
								Bienvenido, identifícate
							</a>
						</li>
						
						{/* ENLACES DE NAVEGACIÓN */}
						<li><a href="/inicio" onClick={closeMenu}>Inicio</a></li>
						<li><a href="/productos" onClick={closeMenu}>Productos</a></li>
						<li><a href="/artistas" onClick={closeMenu}>Artistas</a></li>
						<li><a href="/categorias" onClick={closeMenu}>Categorías</a></li>
					</ul>
				</nav>

				{/*Solo visible en desktop */}
				<div className="header-actions">
					<a href="/login" className="desktop-login-link">
						Bienvenido, identifícate
					</a>
				</div>
			</div>

			{isMenuOpen && (
				<div className="menu-overlay" onClick={closeMenu}></div>
			)}
		</header>
	);
};