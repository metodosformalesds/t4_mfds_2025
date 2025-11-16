/*
    Autor: Erick Rangel
    Fecha: 15-11-2025
    Componente: authModal.jsx
    Descripción:
    Modal que se muestra a un usuario guest al realizar una acción
    que requiere autenticación
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnGeneral } from '../../Botones/btn_general';
import './authModal.css';

export const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth?mode=login');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-content">
          <h3 className="auth-modal-title">Acceso Requerido</h3>
          <p className="auth-modal-message">
            Debe registrarse para usar esta funcionalidad
          </p>
          <div className="auth-modal-buttons">
            <BtnGeneral
              text="Iniciar Sesión"
              color="morado"
              onClick={handleLogin}
              className="auth-modal-btn"
            />
            <BtnGeneral
              text="Cerrar"
              color="amarillo"
              onClick={onClose}
              className="auth-modal-btn"
            />
          </div>
        </div>
      </div>
    </div>
  );
};