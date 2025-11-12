import React, { useState } from "react";
import "./passRecoStyles.css";

export default function ForgotPasswordReborn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const navigate = useNavigate();

  const handleRecoverPassword = () => {
    console.log("Recuperar contraseña:", { username, email });
    // Aquí iría tu lógica de recuperación de contraseña
  };

  const handleCancel = () => {
    setUsername("");
    setEmail("");
  };

  const handleGoBack = () => {
    console.log("Regresar");
    // Aquí iría la navegación de regreso
    // navigate("/login");
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        {/* Panel izquierdo - Información */}
        <div className="forgot-info-panel">
          <div className="info-content-forgot">
            <h2 className="info-title-forgot">
              Para
              <br />
              recuperar tu
              <br />
              contraseña,
              <br />
              llena los
              <br />
              siguientes
              <br />
              campos
            </h2>
            <button onClick={handleGoBack} className="btn-back">
              Regresar
            </button>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="forgot-form-panel">
          <h1 className="forgot-title">
            <span className="title-re-forgot">Re</span>
            <span className="title-born-forgot">born</span>
          </h1>

          <div className="form-container-forgot">
            {/* Input Nombre de usuario */}
            <div className="input-wrapper-forgot">
              <svg
                className="input-icon-forgot"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field-forgot"
              />
            </div>

            {/* Input Email */}
            <div className="input-wrapper-forgot">
              <svg
                className="input-icon-forgot"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field-forgot"
              />
            </div>

            {/* Botones */}
            <div className="button-container-forgot">
              <button onClick={handleRecoverPassword} className="btn-recover">
                Recuperar contraseña
              </button>
              <button onClick={handleCancel} className="btn-cancel-forgot">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}