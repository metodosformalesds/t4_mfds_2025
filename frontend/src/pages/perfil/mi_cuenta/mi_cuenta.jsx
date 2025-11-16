/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra las opciones para llevar a las distintas partes del menú de cuenta
*/

import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import "./mi_cuenta.css";

export default function MiCuenta() {
  const navigate = useNavigate();

  const menuOptions = [
    {
      id: 1,
      title: "Mis pedidos",
      description: "Ver pedidos pendientes, completados, cancelados",
      route: "/mi-cuenta/mis-pedidos",
    },
    {
      id: 2,
      title: "Mis productos",
      description: "Administrar productos que tienes en exposición",
      route: "/mi-cuenta/mis-productos",
    },
    {
      id: 3,
      title: "Mis favoritos",
      description:
        "Artistas o productos favoritos que hayas marcado anteriormente",
      route: "/mi-cuenta/favoritos",
    },
    {
      id: 4,
      title: "Mi información",
      description:
        "Cambiar nombre, foto de perfil, fecha de nacimiento, número telefónico",
      route: "/mi-cuenta/informacion",
    },
    {
      id: 5,
      title: "Seguridad",
      description: "Cambiar contraseña, correo electrónico",
      route: "/mi-cuenta/seguridad",
    },
  ];

  const handleOptionClick = (route) => {
    navigate(route);
  };

  return (
    <div className="mi-cuenta-page">
      <Header />

      <div className="mi-cuenta-container">
        <div className="mi-cuenta-grid">
          {menuOptions.map((option) => (
            <div
              key={option.id}
              className="mi-cuenta-card"
              onClick={() => handleOptionClick(option.route)}
            >
              <div className="card-indicator"></div>
              <div className="card-content">
                <h3 className="card-title">{option.title}</h3>
                <p className="card-description">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

       <Footer />
    </div>
  );
}
