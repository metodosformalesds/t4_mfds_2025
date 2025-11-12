// components/Footer.jsx
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Sección principal */}
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo">Re<span>born</span></div>
              <p className="footer-description">
                Plataforma dedicada a promover y comercializar la artesanía mexicana,
                conectando a artesanos talentosos con amantes del arte tradicional.
              </p>
            </div>

            {/* Enlaces rápidos */}
            <div className="footer-links">
              <div className="link-group">
                <h4>Ayuda</h4>
                <ul>
                  <li><a href="#">Convertirse en artista</a></li>
                  <li><a href="#">Recursos</a></li>
                  <li><a href="#">Comisiones</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4>Contacto</h4>
                <ul>
                  <li><a href="#">info@reborn.com</a></li>
                  <li><a href="#">Facebook: Reborn</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;