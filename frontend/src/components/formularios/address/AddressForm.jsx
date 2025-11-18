/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: AddressForm.jsx
 * Descripción: Componente de formulario para capturar dirección de envío, permite usar dirección
 *              del perfil o ingresar una nueva con validación y consejos de formato.
 */

import React, { useState, useEffect } from 'react';
import { BtnGeneral } from '../../Botones/btn_general';
import './AddressForm.css';

export const AddressForm = ({ 
  user, 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [address, setAddress] = useState('');
  const [useProfileAddress, setUseProfileAddress] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && user.address) {
      setAddress(user.address);
    }
  }, [user]);

  /*
    Autor: Erick Rangel

    Descripción: 
    Cambia entre usar la dirección del perfil o una dirección personalizada.

    Parámetros:
    useProfile - boolean: Si se debe usar la dirección del perfil

    Retorna:
    void
  */
  const handleUseProfileAddressChange = (useProfile) => {
    setUseProfileAddress(useProfile);
    setErrors({});
    
    if (useProfile && user && user.address) {
      setAddress(user.address);
    } else if (useProfile) {
      setAddress('');
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Valida que la dirección de envío sea válida y tenga al menos 10 caracteres.

    Parámetros:
    Ninguno

    Retorna:
    boolean - True si el formulario es válido
  */
  const validateForm = () => {
    const newErrors = {};
    
    if (!address.trim()) {
      newErrors.address = 'La dirección de envío es requerida';
    } else if (address.trim().length < 10) {
      newErrors.address = 'La dirección debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de dirección validando y llamando al callback.

    Parámetros:
    e - Event: Evento del formulario

    Retorna:
    void
  */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(address.trim());
  };

  return (
    <div className="address-form">
      <h3 className="form-title">Dirección de envío</h3>
      
      {/* Usar dirección del perfil */}
      {user && user.address && (
        <div className="profile-address-option">
          <label className="option-label">
            <input
              type="radio"
              checked={useProfileAddress}
              onChange={() => handleUseProfileAddressChange(true)}
              className="option-radio"
            />
            <span className="option-text">
              Usar mi dirección de perfil
            </span>
          </label>
          
          {useProfileAddress && (
            <div className="profile-address-preview">
              <strong>Dirección actual:</strong>
              <p className="address-value">{user.address}</p>
            </div>
          )}
        </div>
      )}

      {/*Ingresar dirección personalizada */}
      <div className="custom-address-option">
        <label className="option-label">
          <input
            type="radio"
            checked={!useProfileAddress}
            onChange={() => handleUseProfileAddressChange(false)}
            className="option-radio"
          />
          <span className="option-text">
            Usar una dirección diferente
          </span>
        </label>
        
        {!useProfileAddress && (
          <div className="custom-address-input">
            <label htmlFor="shipping-address" className="input-label">
              Dirección completa de envío *
            </label>
            <textarea
              id="shipping-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ingresa tu dirección completa: calle, número, colonia, ciudad, estado, código postal"
              className={`address-textarea ${errors.address ? 'error' : ''}`}
              rows="4"
              disabled={useProfileAddress || loading}
            />
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
            
            <div className="address-tips">
              <strong>Consejos para una buena dirección:</strong>
              <ul>
                <li>Incluye calle, número exterior e interior</li>
                <li>Especifica colonia o fraccionamiento</li>
                <li>Agrega ciudad, estado y código postal</li>
                <li>Incluye referencias si es necesario</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Si el usuario no tiene dirección en perfil */}
      {user && !user.address && (
        <div className="no-address-warning">
          <div className="warning-icon"></div>
          <div className="warning-content">
            <strong>No tienes una dirección guardada en tu perfil</strong>
            <p>Te recomendamos agregar una dirección en tu perfil para futuras compras.</p>
          </div>
        </div>
      )}

      {/*BOTONES DE ACCIÓN */}
      <div className="form-actions">
        <BtnGeneral
          text="Cancelar"
          color="amarillo"
          onClick={onCancel}
          disabled={loading}
          className="cancel-btn"
        />
        
        <BtnGeneral
          text={loading ? "Procesando..." : "Continuar al Pago"}
          color="morado"
          onClick={handleSubmit}
          disabled={loading || !address.trim()}
          className="submit-btn"
        />
      </div>
    </div>
  );
};