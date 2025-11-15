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
  const { register, login, forgotPassword, loading, error, clearError } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '', email: '', full_name: '', bio: '', address: '', phone: '', password: '', confirmPassword: ''
  });
  const [forgotData, setForgotData] = useState({ username: '', email: '' });

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode && ['login', 'register', 'forgot-password'].includes(urlMode)) {
      setMode(urlMode);
    }
  }, [searchParams]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearError();
    navigate(`/auth?mode=${newMode}`, { replace: true });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

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
      console.error('Registration failed:', error);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotData);
      alert('Se ha enviado un enlace de recuperación a tu email');
      handleModeChange('login');
    } catch (error) {
      console.error('Password recovery failed:', error);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`auth-container ${mode === 'register' ? 'auth-register-mode' : ''} ${mode === 'forgot-password' ? 'auth-recovery-mode' : ''}`}>
      
      {/* MODO LOGIN */}
      {mode === 'login' && (
        <div className="auth-card auth-fade-in">
          <div className="auth-side-white">
            <div className="auth-logo">Reborn</div>
            <form onSubmit={handleLoginSubmit} className="auth-form-container">
              <div className="auth-input-group">
                <img className="auth-input-icon email-icon" alt="Email" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Contraseña" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Usuario" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Nombre completo" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon email-icon" alt="Email" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon direccion-icon" alt="Direccion" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Contraseña" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Confirmar contraseña" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon" alt="Usuario" src="https://placehold.co/10x10" />
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
                <img className="auth-input-icon email-icon" alt="Email" src="https://placehold.co/10x10" />
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
    </div>
  );
};