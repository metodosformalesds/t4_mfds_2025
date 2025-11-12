import React, { useState } from 'react';
import './Header.css';

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<header className="header">
			<div className="header-container">
				<div className="header-logo">
					<div className="logo">Re<span>born</span></div>
				</div>

				<button className="menu-toggle" onClick={toggleMenu}>
					<span></span>
					<span></span>
					<span></span>
				</button>

				<nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
					<ul>
            <li className="mobile-login-item">
              <a href="/login" className="mobile-login-link">
                <span className="login-icon"></span>
                  Bienvenido, identifícate
              </a>
            </li>
						<li><a href="/inicio">Inicio</a></li>
						<li><a href="/productos">Productos</a></li>
						<li><a href="/artistas">Artistas</a></li>
						<li><a href="/categorias">Categorías</a></li>
            
					</ul>
				</nav>

				<div className="header-actions">
					<a href="/login">Bienvenido, identifícate</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
