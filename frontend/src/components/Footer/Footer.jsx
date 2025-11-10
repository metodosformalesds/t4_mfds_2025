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
                <h4>Explorar</h4>
                <ul>
                  <li><a href="#">Inicio</a></li>
                  <li><a href="#">Productos</a></li>
                  <li><a href="#">Artistas</a></li>
                  <li><a href="#">Categorías</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4>Comprar</h4>
                <ul>
                  <li><a href="#">Cómo Comprar</a></li>
                  <li><a href="#">Preguntas Frecuentes</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4>Artistas</h4>
                <ul>
                  <li><a href="#">Convertirse en artista</a></li>
                  <li><a href="#">Recursos</a></li>
                  <li><a href="#">Comisiones</a></li>
                </ul>
              </div>

              <div className="link-group">
                <h4>Contacto</h4>
                <ul>
                  <li><a href="#">Sobre Nosotros</a></li>
                  <li><a href="#">Términos de Servicio</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Línea separadora */}
          <div className="footer-divider"></div>

          {/* Pie inferior */}
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>&copy; 2024 ArteMex. Todos los derechos reservados.</p>
              <div className="legal-links">
                <a href="#">Privacidad</a>
                <a href="#">Términos</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;