import React, { useState } from 'react';
import './loginStyles.css';

export default function LoginReborn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login clicked', { email, password });
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-container">
      {/* Círculo morado superior izquierdo */}
      <div className="circle-purple"></div>
      
      {/* Círculo amarillo inferior derecho */}
      <div className="circle-yellow"></div>

      <div className="login-card">
        {/* Panel izquierdo - Formulario */}
        <div className="login-form-panel">
          <h1 className="login-title">
            <span className="title-re">Re</span>
            <span className="title-born">born</span>
          </h1>

          <div className="form-container">
            {/* Input Email */}
            <div className="input-wrapper">
              <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Input Contraseña */}
            <div className="input-wrapper">
              <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Botones */}
            <div className="button-container">
              <button onClick={handleLogin} className="btn-login">
                Login
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                Cancelar
              </button>
            </div>

            {/* Link olvidé contraseña */}
            <div className="forgot-password">
              <button className="forgot-link">
                Olvidé mi contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Panel derecho - Información */}
        <div className="login-info-panel">
          <div className="info-content">
            <h2 className="info-title">
              Ingresa tu<br />
              e-mail y<br />
              contraseña<br />
              para<br />
              iniciar<br />
              sesión
            </h2>
            <button className="btn-create-account">
              Crear una cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}