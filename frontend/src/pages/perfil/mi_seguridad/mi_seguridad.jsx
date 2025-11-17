/* 
    Autor: Ian Domínguez - Erick Rangel
    Fecha: 15 de noviembre de 2025
    Descripción: Vista para mostrar la info confidencial del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../../components/Botones/btn_general';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import "./mi_seguridad.css";
import { authService } from '../../../services/authService';
import { apiClient } from '../../../services/api';
import { userService } from '../../../services/userService';

export default function Seguridad() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    field: null,
    value: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      const mappedUser = {
        nombre: userData.full_name || "",
        username: userData.username || "",
        email: userData.email || "",
        avatar: userData.profile_picture || 
                userData.profile_picture_url ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      };
      setUsuario(mappedUser);
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      const savedUser = authService.getUser();
      if (savedUser) {
        const mappedUser = {
          nombre: savedUser.full_name || "",
          username: savedUser.username || "",
          email: savedUser.email || "",
          avatar: savedUser.profile_picture || 
                  savedUser.profile_picture_url ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        };
        setUsuario(mappedUser);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModificarEmail = () => {
    setModalState({ isOpen: true, field: "email", value: usuario.email });
  };

  const handleModificarPassword = () => {
    setModalState({ isOpen: true, field: "password", value: "" });
  };

  const handleGuardarCambio = async () => {
    if (!modalState.value.trim()) {
      alert("El campo no puede estar vacío");
      return;
    }

    try {
      const updateData = {};
      
      if (modalState.field === "email") updateData.email = modalState.value;
      if (modalState.field === "password") updateData.password = modalState.value;

      const token = authService.getToken();
      const base = apiClient.baseURL ? apiClient.baseURL.replace(/\/$/, '') : '';
      const url = `${base}/api/users/me`;

      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || resp.statusText || 'Error al actualizar');
      }

      const data = await resp.json();

      if (modalState.field === "email") {
        setUsuario((prev) => ({
          ...prev,
          email: modalState.value,
        }));
      }

      setModalState({ isOpen: false, field: null, value: "" });
      alert("Cambio guardado correctamente");
    } catch (error) {
      console.error("Error guardando cambio:", error);
      alert(error.message || "Error al guardar el cambio");
    }
  };

  const handleCerrarModal = () => {
    setModalState({ isOpen: false, field: null, value: "" });
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
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </span>
          {" > "} Mi información
        </div>

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

      {/* Modal de edición */}
      {modalState.isOpen && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              Editar {modalState.field === "email" ? "Correo electrónico" : "Contraseña"}
            </h2>
            
            <input
              type={modalState.field === "email" ? "email" : "password"}
              className="modal-input"
              value={modalState.value}
              onChange={(e) => setModalState({ ...modalState, value: e.target.value })}
              placeholder={modalState.field === "email" ? "Nuevo correo" : "Nueva contraseña"}
            />

            <div className="modal-botones">
              <BtnGeneral
                text="Cancelar"
                color="amarillo"
                onClick={handleCerrarModal}
              />
              <BtnGeneral
                text="Guardar"
                color="morado"
                property1="default"
                onClick={handleGuardarCambio}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}