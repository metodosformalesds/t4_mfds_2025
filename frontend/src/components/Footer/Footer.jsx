/* 
  Autor: Erick Rangel
  Fecha: 11 de noviembre de 205
  Componente: footer
  Descripción: 
  
  muestra logo, links de navegación e información de contacto
  se exporta a otros lados del código usando index.js
*/

import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = ({ className, href }) => {
    return (
        <div className={`footer ${className}`}>
            <div className="columnas">
                <div className="columna">
                    <div className="texto-raya">
                        <div className="logo">Re<span>born</span></div>
                    </div>

                    <p className="plataforma-dedicada">
                        Plataforma dedicada a promover y comercializar la artesanía
                        mexicana,&nbsp;&nbsp;conectando a artesanos talentosos con amantes
                        del arte tradicional.
                    </p>
                </div>

                <div className="div">
                    <div className="texto-raya">
                        <div className="text-wrapper">Ayuda</div>
                    </div>

                    <Link to="/faq" className="text-wrapper-2">Preguntas frecuentes</Link>

                    <Link to="/terminos-condiciones" className="text-wrapper-2">Términos y condiciones</Link>

                    <Link to="/metodos-pago" className="text-wrapper-2">Métodos de pago</Link>
                </div>

                <div className="columna-2">
                    <div className="texto-raya">
                        <div className="text-wrapper">Contacto</div>
                    </div>

                    <div className="frame">
                        <a
                            className="text-wrapper-3"
                            href={href}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            info@reborn.com
                        </a>
                    </div>
                </div>
            </div>

            <div className="derechos-reservados">
                <div className="text-wrapper-4">2025 Reborn. Derechos reservados.</div>
            </div>
        </div>
    );
};

Footer.propTypes = {
    href: PropTypes.string,
};