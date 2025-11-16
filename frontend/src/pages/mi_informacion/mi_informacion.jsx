/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra la vista con toda la información del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./mi_informacion.css";

export default function MiInformacion() {
  const navigate = useNavigate();
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
      telefono: "+52 656 124 6789",
      fechaNacimiento: "1992-07-18",
      direccion: "Calle 1234",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    };

    setUsuario(mockUser);
    setLoading(false);
  };

  const handleEditarFoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Archivo seleccionado:", file);
        // Implementar subida de imagen
      }
    };
    input.click();
  };

  const handleModificarUsername = () => {
    console.log("Modificar nombre de usuario");
  };

  const handleModificarNombre = () => {
    console.log("Modificar nombre personal");
  };

  const handleModificarTelefono = () => {
    console.log("Modificar teléfono");
  };

  const handleModificarFecha = () => {
    console.log("Modificar fecha de nacimiento");
  };

  const handleModificarDireccion = () => {
    console.log("Modificar dirección");
  };

  const handleNavigateToSeguridad = () => {
    navigate("/mi-cuenta/seguridad");
  };

  if (loading) {
    return (
      <div className="mi-informacion-page">
         <Header />
        <div className="loading-container">Cargando información...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mi-informacion-page">
      <Header />

      <div className="mi-informacion-container">
        <div className="breadcrumb">Mi cuenta {">"} Mi información</div>

        {/* Información del usuario */}
        <div className="perfil-header">
          <div className="avatar-container" onClick={handleEditarFoto}>
            <img
              src={usuario.avatar}
              alt={usuario.nombre}
              className="avatar-imagen"
            />
            <div className="avatar-overlay">
              <svg
                className="editar-icono-svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              <span className="editar-texto">Editar</span>
            </div>
          </div>
          <div className="perfil-info">
            <h1 className="perfil-nombre">
              {usuario.nombre}{" "}
              <span className="perfil-username">({usuario.username})</span>
            </h1>
            <p className="perfil-email">{usuario.email}</p>
          </div>
        </div>

        {/* Nombre de usuario */}
        <div className="seccion-info">
          <div className="seccion-datos">
            <h3 className="seccion-titulo">Nombre de usuario</h3>
            <p className="seccion-valor">{usuario.username}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarUsername}
            className="btn-modificar"
          />
        </div>

        {/* Nombre personal */}
        <div className="seccion-info">
          <div className="seccion-datos">
            <h3 className="seccion-titulo">Nombre personal</h3>
            <p className="seccion-valor">{usuario.nombre}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarNombre}
            className="btn-modificar"
          />
        </div>

        {/* Teléfono */}
        <div className="seccion-info">
          <div className="seccion-datos">
            <h3 className="seccion-titulo">Teléfono</h3>
            <p className="seccion-valor">{usuario.telefono}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarTelefono}
            className="btn-modificar"
          />
        </div>

        {/* Fecha de nacimiento */}
        <div className="seccion-info">
          <div className="seccion-datos">
            <h3 className="seccion-titulo">Fecha de nacimiento</h3>
            <p className="seccion-valor">{usuario.fechaNacimiento}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarFecha}
            className="btn-modificar"
          />
        </div>

        {/* Dirección */}
        <div className="seccion-info">
          <div className="seccion-datos">
            <h3 className="seccion-titulo">Dirección</h3>
            <p className="seccion-valor">{usuario.direccion}</p>
          </div>
          <BtnGeneral
            property1="default"
            color="morado"
            text="Modificar"
            onClick={handleModificarDireccion}
            className="btn-modificar"
          />
        </div>

        {/* Card de Seguridad */}
        <div className="seguridad-card-container">
          <div className="seguridad-card" onClick={handleNavigateToSeguridad}>
            <div className="card-indicator"></div>
            <div className="card-content">
              <h3 className="card-title">Seguridad</h3>
              <p className="card-description">
                Cambiar contraseña, correo electrónico
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
