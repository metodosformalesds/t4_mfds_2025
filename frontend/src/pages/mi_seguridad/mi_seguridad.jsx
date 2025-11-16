/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Vista para mostrar la info confidencial del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./mi_seguridad.css";

export default function Seguridad() {
  //const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);

    // Aquí harías tu fetch a la API
    // const response = await fetch('/api/usuario/perfil');

    // Datos de ejemplo
    const mockUser = {
      nombre: "María Fernanda López",
      username: "mferlopez92",
      email: "m.fernanda.lopez92@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    };

    setUsuario(mockUser);
    setLoading(false);
  };

  const handleModificarEmail = () => {
    console.log("Modificar email");
    // Implementar modal o navegación para cambiar email
  };

  const handleModificarPassword = () => {
    console.log("Modificar contraseña");
    // Implementar modal o navegación para cambiar contraseña
  };

  const handleNavigateToInfo = () => {
    navigate("/mi-cuenta/informacion");
  };

  if (loading) {
    return (
      <div className="seguridad-page">
        <Header />
        <div className="loading-container">Cargando información...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="seguridad-page">
      <Header />

      <div className="seguridad-container">
        <div className="breadcrumb">Mi cuenta {">"} Seguridad</div>

        {/* Información del usuario (solo visualización, sin edición) */}
        <div className="perfil-header">
          <img
            src={usuario.avatar}
            alt={usuario.nombre}
            className="avatar-imagen"
          />
          <div className="perfil-info">
            <h1 className="perfil-nombre">
              {usuario.nombre}{" "}
              <span className="perfil-username">({usuario.username})</span>
            </h1>
            <p className="perfil-email">{usuario.email}</p>
          </div>
        </div>

        {/* Sección de Correo Electrónico */}
        <div className="seccion-seguridad">
          <div className="seccion-info">
            <h3 className="seccion-titulo">Correo electrónico</h3>
            <p className="seccion-valor">{usuario.email}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarEmail}
            className="btn-modificar"
          />
        </div>

        {/* Sección de Contraseña */}
        <div className="seccion-seguridad">
          <div className="seccion-info">
            <h3 className="seccion-titulo">Contraseña</h3>
            <p className="seccion-valor">••••••••</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarPassword}
            className="btn-modificar"
          />
        </div>

        {/* Card de Mi información */}
        <div className="info-card-container">
          <div className="info-card" onClick={handleNavigateToInfo}>
            <div className="card-indicator"></div>
            <div className="card-content">
              <h3 className="card-title">Mi información</h3>
              <p className="card-description">
                Cambiar nombre, foto de perfil, fecha de nacimiento, número
                telefónico
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
