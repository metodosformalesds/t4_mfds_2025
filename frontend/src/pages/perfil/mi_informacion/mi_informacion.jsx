/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra la vista con toda la información del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../../components/Botones/btn_general';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import "./mi_informacion.css";
import { authService } from '../../../services/authService';
import { apiClient } from '../../../services/api';
import { userService } from '../../../services/userService';

export default function MiInformacion() {
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
      // Obtener usuario desde la API
      const userData = await userService.getCurrentUser();

      // Mapear respuesta del backend a estructura local
      const mappedUser = {
        nombre: userData.full_name || "",
        username: userData.username || "",
        email: userData.email || "",
        telefono: userData.phone || "",
        fechaNacimiento: userData.date_of_birth || "",
        direccion: userData.address || "",
        avatar: userData.profile_picture || 
                userData.profile_picture_url ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      };

      setUsuario(mappedUser);
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      
      // Fallback: intentar obtener desde localStorage si ya está guardado
      const savedUser = authService.getUser();
      if (savedUser) {
        const mappedUser = {
          nombre: savedUser.full_name || "",
          username: savedUser.username || "",
          email: savedUser.email || "",
          telefono: savedUser.phone || "",
          fechaNacimiento: savedUser.date_of_birth || "",
          direccion: savedUser.address || "",
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

  const handleEditarFoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validaciones simples
        if (!file.type.startsWith('image/')) {
          alert('El archivo debe ser una imagen');
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('La imagen es demasiado grande. Máximo 5MB.');
          return;
        }

        // Subir la imagen al endpoint PUT /api/users/me como FormData
        (async () => {
          try {
            const formData = new FormData();
            // El backend espera 'profile_picture' como campo File
            formData.append('profile_picture', file, file.name);

            const token = authService.getToken();
            const base = apiClient.baseURL ? apiClient.baseURL.replace(/\/$/, '') : '';
            const url = `${base}/api/users/me`;

            const resp = await fetch(url, {
              method: 'PUT',
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              body: formData,
            });

            if (!resp.ok) {
              const err = await resp.json().catch(() => ({}));
              throw new Error(err.detail || resp.statusText || 'Error al subir la imagen');
            }

            const data = await resp.json();

            // Actualizar UI local con la nueva URL de perfil si viene en la respuesta
            const newAvatar = data.profile_picture || data.profile_picture_url || data.profilePicture || null;
            setUsuario((prev) => ({
              ...prev,
              avatar: newAvatar || prev.avatar,
              nombre: data.full_name || prev.nombre,
              username: data.username || prev.username,
              email: data.email || prev.email,
              telefono: data.phone || prev.telefono,
              direccion: data.address || prev.direccion,
            }));

            alert('Foto de perfil actualizada correctamente');
          } catch (error) {
            console.error('Error subiendo foto de perfil:', error);
            alert(error.message || 'Error al subir la imagen');
          }
        })();
      }
    };
    input.click();
  };

  const handleModificarUsername = () => {
    setModalState({ isOpen: true, field: "username", value: usuario.username });
  };

  const handleModificarNombre = () => {
    setModalState({ isOpen: true, field: "nombre", value: usuario.nombre });
  };

  const handleModificarTelefono = () => {
    setModalState({ isOpen: true, field: "telefono", value: usuario.telefono });
  };

  const handleModificarDireccion = () => {
    setModalState({ isOpen: true, field: "direccion", value: usuario.direccion });
  };

  const handleNavigateToSeguridad = () => {
    navigate("/mi-cuenta/seguridad");
  };

  // Función para guardar cambios vía PATCH
  const handleGuardarCambio = async () => {
    if (!modalState.value.trim()) {
      alert("El campo no puede estar vacío");
      return;
    }

    try {
      const updateData = {};
      
      // Mapear campo local a nombre de API
      if (modalState.field === "username") updateData.username = modalState.value;
      if (modalState.field === "nombre") updateData.full_name = modalState.value;
      if (modalState.field === "telefono") updateData.phone = modalState.value;
      if (modalState.field === "direccion") updateData.address = modalState.value;

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

      // Actualizar estado local
      const fieldMapping = {
        username: 'username',
        nombre: 'full_name',
        telefono: 'phone',
        direccion: 'address',
      };

      setUsuario((prev) => ({
        ...prev,
        [modalState.field]: modalState.value,
      }));

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
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </span>
          {" > "} Mi información
        </div>

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

      {/* Modal de edición */}
      {modalState.isOpen && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              Editar {modalState.field === "username" ? "Nombre de usuario" :
                      modalState.field === "nombre" ? "Nombre personal" :
                      modalState.field === "telefono" ? "Teléfono" :
                      "Dirección"}
            </h2>
            
            <input
              type={modalState.field === "fechaNacimiento" ? "date" : 
                     modalState.field === "telefono" ? "tel" : "text"}
              className="modal-input"
              value={modalState.value}
              onChange={(e) => setModalState({ ...modalState, value: e.target.value })}
              placeholder="Ingresa el nuevo valor"
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
