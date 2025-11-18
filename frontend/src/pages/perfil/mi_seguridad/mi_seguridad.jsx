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

/*
  Autor: Erick Rangel

  Descripción: Componente de la página de seguridad que permite al usuario modificar su correo electrónico, contraseña y convertirse en artista si es cliente.

  Parámetros: Ninguno

  Retorna: JSX.Element - Página de configuración de seguridad con opciones de modificación
*/
export default function Seguridad() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    field: null,
    value: "",
  });
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [convertingToArtist, setConvertingToArtist] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  /*
    Autor: Erick Rangel

    Descripción: Obtiene los datos del usuario desde el servidor incluyendo su rol.

    Parámetros: Ninguno

    Retorna: Promise<void>
  */
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = await userService.getCurrentUser();
      const mappedUser = {
        nombre: userData.full_name || "",
        username: userData.username || "",
        email: userData.email || "",
        rol: userData.rol || "customer",
        avatar: userData.profile_picture || 
                userData.profile_picture_url ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      };
      setUsuario(mappedUser);
    } catch (error) {
            const savedUser = authService.getUser();
      if (savedUser) {
        const mappedUser = {
          nombre: savedUser.full_name || "",
          username: savedUser.username || "",
          email: savedUser.email || "",
          rol: savedUser.rol || "customer",
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

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar el correo electrónico.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarEmail = () => {
    setModalState({ isOpen: true, field: "email", value: usuario.email });
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar la contraseña.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarPassword = () => {
    setModalState({ isOpen: true, field: "password", value: "" });
  };

  /*
    Autor: Erick Rangel

    Descripción: Guarda los cambios de email o contraseña realizados en el modal.

    Parámetros: Ninguno

    Retorna: Promise<void>
  */
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
            alert(error.message || "Error al guardar el cambio");
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Cierra el modal de edición.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleCerrarModal = () => {
    setModalState({ isOpen: false, field: null, value: "" });
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de información personal.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleNavigateToInfo = () => {
    navigate("/mi-cuenta/informacion");
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal de confirmación para convertirse en artista.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleConvertirArtista = () => {
    setShowArtistModal(true);
  };

  /*
    Autor: Erick Rangel

    Descripción: Confirma la conversión del usuario de cliente a artista, actualizando su rol en el servidor y en el estado local.

    Parámetros: Ninguno

    Retorna: Promise<void>
  */
  const handleConfirmarConversion = async () => {
    try {
      setConvertingToArtist(true);
      const token = authService.getToken();
      const base = apiClient.baseURL ? apiClient.baseURL.replace(/\/$/, '') : '';
      const url = `${base}/api/users/me`;

      const resp = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rol: 'artist' }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || resp.statusText || 'Error al actualizar rol');
      }

      const data = await resp.json();
      
      setUsuario((prev) => ({
        ...prev,
        rol: 'artist',
      }));

      const currentUser = authService.getUser();
      if (currentUser) {
        authService.setUser({ ...currentUser, rol: 'artist' });
      }

      setShowArtistModal(false);
      alert('¡Ahora eres un artista! Puedes comenzar a publicar tus productos.');
    } catch (error) {
            alert(error.message || 'Error al cambiar el rol');
    } finally {
      setConvertingToArtist(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Cancela el proceso de conversión a artista y cierra el modal.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleCancelarConversion = () => {
    setShowArtistModal(false);
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
          {" > "} Mi seguridad
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

        {/* Sección de Convertirse en Artista (solo si el rol es customer) */}
        {usuario.rol === 'customer' && (
          <div className="seccion-seguridad">
            <div className="seccion-info">
              <h3 className="seccion-titulo">Cambiar rol a artista</h3>
              <p className="seccion-valor">
              </p>
            </div>
            <BtnGeneral
              property1="default"
              color="rosa"
              text="Ser Artista"
              onClick={handleConvertirArtista}
              className="btn-modificar"
            />
          </div>
        )}

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

      {/* Modal de confirmación para convertirse en artista */}
      {showArtistModal && (
        <div className="modal-overlay" onClick={handleCancelarConversion}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">¿Convertirse en artista?</h2>
            
            <p className="modal-warning">
              <strong>Esta acción es irreversible.</strong>
            </p>
            <p className="modal-description">
              Al convertirte en artista, podrás publicar y vender tus productos en la plataforma.
              Una vez realizado el cambio, no podrás volver al rol de cliente.
            </p>
            <p className="modal-description">
              ¿Estás seguro de que deseas continuar?
            </p>

            <div className="modal-botones">
              <BtnGeneral
                text="Cancelar"
                color="amarillo"
                onClick={handleCancelarConversion}
                disabled={convertingToArtist}
              />
              <BtnGeneral
                text={convertingToArtist ? "Procesando..." : "Confirmar"}
                color="rosa"
                property1="default"
                onClick={handleConfirmarConversion}
                disabled={convertingToArtist}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}