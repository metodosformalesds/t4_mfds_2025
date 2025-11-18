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

/*
  Autor: Erick Rangel

  Descripción: Componente que muestra y permite editar la información personal del usuario (nombre, username, teléfono, dirección y foto de perfil). Incluye modales para la edición de cada campo.

  Parámetros: Ninguno

  Retorna: JSX.Element - Página de información personal del usuario con opciones de edición
*/
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

  /*
    Autor: Erick Rangel

    Descripción: Obtiene los datos del usuario actual desde el servidor y los mapea al estado local. Si falla, intenta cargar desde el almacenamiento local.

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
        telefono: userData.phone || "",
        fechaNacimiento: userData.date_of_birth || "",
        direccion: userData.address || "",
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

  /*
    Autor: Erick Rangel

    Descripción: Permite al usuario seleccionar y subir una nueva foto de perfil. Valida el tipo y tamaño del archivo antes de enviarlo al servidor.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleEditarFoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('El archivo debe ser una imagen');
          return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          alert('La imagen es demasiado grande. Máximo 5MB.');
          return;
        }

        (async () => {
          try {
            const formData = new FormData();
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
                        alert(error.message || 'Error al subir la imagen');
          }
        })();
      }
    };
    input.click();
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar el nombre de usuario.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarUsername = () => {
    setModalState({ isOpen: true, field: "username", value: usuario.username });
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar el nombre personal.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarNombre = () => {
    setModalState({ isOpen: true, field: "nombre", value: usuario.nombre });
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar el teléfono.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarTelefono = () => {
    setModalState({ isOpen: true, field: "telefono", value: usuario.telefono });
  };

  /*
    Autor: Erick Rangel

    Descripción: Abre el modal para modificar la dirección.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleModificarDireccion = () => {
    setModalState({ isOpen: true, field: "direccion", value: usuario.direccion });
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de seguridad.

    Parámetros: Ninguno

    Retorna: void
  */
  const handleNavigateToSeguridad = () => {
    navigate("/mi-cuenta/seguridad");
  };

  /*
    Autor: Erick Rangel

    Descripción: Guarda los cambios realizados en el modal de edición, enviando una petición PATCH al servidor con los nuevos datos.

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
            alert(error.message || "Error al guardar el cambio");
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Cierra el modal de edición y resetea su estado.

    Parámetros: Ninguno

    Retorna: void
  */
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
