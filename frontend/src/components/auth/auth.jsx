/* 
  Autor: Ian Domínguez
  Fecha: 11 de noviembre de 205
  Componente: vista de para autenticación de usuario
  Descripción: Muestra un formulario para el inicio de sesión, registro o recuperar contraseña
*/

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BtnGeneral } from '../Botones/btn_general';
import './auth.css';

export const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, login, forgotPassword, resetPassword, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '', email: '', full_name: '', bio: '', address: '', phone: '', password: '', confirmPassword: ''
  });
  const [forgotData, setForgotData] = useState({ username: '', email: '' });
  const [resetData, setResetData] = useState({ token: '', newPassword: '', confirmPassword: '' });
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode && ['login', 'register', 'forgot-password', 'reset-password'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [searchParams]);

  /*
    Autor: Erick Rangel

    Descripción: 
    Cambia el modo de autenticación (login, registro, recuperar contraseña, etc.)
    y actualiza la URL.

    Parámetros:
    newMode - string: El nuevo modo de autenticación

    Retorna:
    void
  */
  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearError();
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de inicio de sesión.

    Parámetros:
    e - Event: Evento del formulario

    Retorna:
    Promise<void>
  */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
    } catch (error) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de registro. Valida que las contraseñas coincidan
    antes de crear la cuenta.

    Parámetros:
    e - Event: Evento del formulario

    Retorna:
    Promise<void>
  */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const { confirmPassword, ...userData } = registerData;
      await register(userData);
    } catch (error) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de recuperación de contraseña. Envía el código
    de verificación al correo del usuario.

    Parámetros:
    e - Event: Evento del formulario

    Retorna:
    Promise<void>
  */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotData);
      setShowInstructionsModal(true);
    } catch (error) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Maneja el envío del formulario de restablecimiento de contraseña. Valida que
    las contraseñas coincidan y actualiza la contraseña con el token.

    Parámetros:
    e - Event: Evento del formulario

    Retorna:
    Promise<void>
  */
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await resetPassword(resetData.token, resetData.newPassword);
      alert('Contraseña actualizada correctamente');
      handleModeChange('login');
    } catch (error) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Actualiza el estado del formulario de login cuando cambian los valores de los campos.

    Parámetros:
    e - Event: Evento del input

    Retorna:
    void
  */
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Actualiza el estado del formulario de registro cuando cambian los valores de los campos.

    Parámetros:
    e - Event: Evento del input

    Retorna:
    void
  */
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Actualiza el estado del formulario de recuperación de contraseña.

    Parámetros:
    e - Event: Evento del input

    Retorna:
    void
  */
  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({ ...prev, [name]: value }));
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Actualiza el estado del formulario de restablecimiento de contraseña.

    Parámetros:
    e - Event: Evento del input

    Retorna:
    void
  */
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Cierra el modal de instrucciones y cambia al modo de restablecimiento de contraseña.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const closeInstructionsModal = () => {
    setShowInstructionsModal(false);
    handleModeChange('reset-password');
  };

  return (
    <div className={`auth-container ${mode === 'register' ? 'auth-register-mode' : ''} ${mode === 'forgot-password' || mode === 'reset-password' ? 'auth-recovery-mode' : ''}`}>
      
      {/* MODAL DE INSTRUCCIONES */}
      {showInstructionsModal && (
        <div className="auth-modal-overlay" onClick={closeInstructionsModal}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h2>Revisa tu correo electrónico</h2>
            </div>
            <div className="auth-modal-body">
              <p>
                Si el correo existe en nuestro sistema, hemos enviado un email con instrucciones 
                para restablecer tu contraseña.
              </p>
              <p>
                Por favor revisa tu bandeja de entrada y busca el <strong>código de verificación</strong>.
              </p>
              <p className="auth-modal-note">
                <strong>Nota:</strong> El código expira en 15 minutos.
              </p>
            </div>
            <div className="auth-modal-footer">
              <BtnGeneral
                property1='default'
                text="Continuar"
                color="morado"
                onClick={closeInstructionsModal}
                className="auth-modal-button"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* MODO LOGIN */}
      {mode === 'login' && (
        <div className="auth-card auth-fade-in">
          <div className="auth-side-white">
            <div className="auth-logo">Reborn</div>
            <form onSubmit={handleLoginSubmit} className="auth-form-container">
              <div className="auth-input-group">
                <img className="auth-input-icon email-icon" alt="Email" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/email-icon.svg" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Contraseña" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="auth-input"
                />
              </div>
              
              {error && <div className="auth-error-message">{error}</div>}
              
              <div className="auth-buttons-container">
                <BtnGeneral 
                  property1='default'
                  text={loading ? "Iniciando sesión..." : "Login"} 
                  color="morado"
                  onClick={handleLoginSubmit}
                  disabled={loading}
                  className="auth-form-button"
                />
                <BtnGeneral
                  property1='default'
                  text="Volver a inicio" 
                  color="amarillo"
                  onClick={() => navigate('/')}
                  disabled={loading}
                  className="auth-form-button"
                />
              </div>
              <div 
                className="auth-link"
                onClick={() => handleModeChange('forgot-password')}
              >
                Olvidé mi contraseña
              </div>
            </form>
          </div>
          <div className="auth-side-purple">
            <div className="auth-welcome-text">
              Ingresa tu e-mail y contraseña para iniciar sesión
            </div>
            <BtnGeneral 
              property1='default'
              text="Crear una cuenta" 
              color="rosa"
              onClick={() => handleModeChange('register')}
              className="auth-side-button"
            />
          </div>
        </div>
      )}

      {/* MODO REGISTRO */}
      {mode === 'register' && (
        <div className="auth-card auth-fade-in">
          <div className="auth-side-purple">
            <div className="auth-welcome-text">
              Para crear una cuenta, llena los siguientes campos
            </div>
            <BtnGeneral
              property1='default'
              text="Login" 
              color="rosa"
              onClick={() => handleModeChange('login')}
              className="auth-side-button"
            />
          </div>
          <div className="auth-side-white">
            <div className="auth-logo">Reborn</div>
            <form onSubmit={handleRegisterSubmit} className="auth-form-container">
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Usuario" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/user-icon.svg" />
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Nombre completo" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/user-icon.svg" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nombre completo"
                  value={registerData.full_name}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon email-icon" alt="Email" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/email-icon.svg" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon direccion-icon" alt="Direccion" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/address-icon.svg" />
                <input
                  type="text"
                  name="address"
                  placeholder="Dirección"
                  value={registerData.address}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Contraseña" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Confirmar contraseña" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="auth-input"
                />
              </div>
              
              {error && <div className="auth-error-message">{error}</div>}
              
              <div className="auth-buttons-container">
                <BtnGeneral
                  property1='default'
                  text={loading ? "Creando cuenta..." : "Crear cuenta"} 
                  color="morado"
                  onClick={handleRegisterSubmit}
                  disabled={loading}
                  className="auth-form-button"
                />
                <BtnGeneral 
                  property1='default'
                  text="Volver a inicio" 
                  color="amarillo"
                  onClick={() => navigate('/')}
                  disabled={loading}
                  className="auth-form-button"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECUPERAR PASSWORD */}
      {mode === 'forgot-password' && (
        <div className="auth-card auth-fade-in">
          <div className="auth-side-purple">
            <div className="auth-welcome-text">
              Para recuperar tu contraseña, llena los siguientes campos
            </div>
            <BtnGeneral 
              property1='default'
              text="Regresar" 
              color="rosa"
              onClick={() => handleModeChange('login')}
              className="auth-side-button"
            />
          </div>
          <div className="auth-side-white">
            <div className="auth-logo">Reborn</div>
            <form onSubmit={handleForgotSubmit} className="auth-form-container">
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Usuario" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/user-icon.svg" />
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={forgotData.username}
                  onChange={handleForgotChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon email-icon" alt="Email" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/email-icon.svg" />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  required
                  className="auth-input"
                />
              </div>
              
              {error && <div className="auth-error-message">{error}</div>}
              
              <div className="auth-buttons-container">
                <BtnGeneral 
                  property1='default'
                  text={loading ? "Procesando..." : "Recuperar contraseña"} 
                  color="morado"
                  onClick={handleForgotSubmit}
                  disabled={loading}
                  className="auth-form-button"
                />
                <BtnGeneral 
                  property1='default'
                  text="Volver a inicio" 
                  color="amarillo"
                  onClick={() => navigate('/')}
                  disabled={loading}
                  className="auth-form-button"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESETEAR PASSWORD CON TOKEN */}
      {mode === 'reset-password' && (
        <div className="auth-card auth-fade-in">
          <div className="auth-side-purple">
            <div className="auth-welcome-text">
              Ingresa el código que recibiste en tu correo y tu nueva contraseña
            </div>
            <BtnGeneral 
              property1='default'
              text="Regresar" 
              color="rosa"
              onClick={() => handleModeChange('login')}
              className="auth-side-button"
            />
          </div>
          <div className="auth-side-white">
            <div className="auth-logo">Reborn</div>
            <form onSubmit={handleResetSubmit} className="auth-form-container">
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Token" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="text"
                  name="token"
                  placeholder="Código de verificación"
                  value={resetData.token}
                  onChange={handleResetChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Nueva contraseña" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nueva contraseña"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                  required
                  className="auth-input"
                />
              </div>
              <div className="auth-input-group">
                <img className="auth-input-icon" alt="Confirmar contraseña" src="https://reborn-s3-metodos.s3.us-east-1.amazonaws.com/authentication/password-icon.svg" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={resetData.confirmPassword}
                  onChange={handleResetChange}
                  required
                  className="auth-input"
                />
              </div>
              
              {error && <div className="auth-error-message">{error}</div>}
              
              <div className="auth-buttons-container">
                <BtnGeneral 
                  property1='default'
                  text={loading ? "Actualizando..." : "Restablecer contraseña"} 
                  color="morado"
                  onClick={handleResetSubmit}
                  disabled={loading}
                  className="auth-form-button"
                />
                <BtnGeneral 
                  property1='default'
                  text="Volver a inicio" 
                  color="amarillo"
                  onClick={() => navigate('/')}
                  disabled={loading}
                  className="auth-form-button"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};