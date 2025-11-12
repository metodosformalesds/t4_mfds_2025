import React, { useState } from "react";
import "./registerStyles.css";

export default function RegisterReborn() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  /* const navigate = useNavigate(); */

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!username || !email || !password){
      setError("Por favor completa llena todos los campos");
      return;
    }
    // console.log("Registro:", { username, email});
    // Aquí iría tu lógica de registro

    /* 
    Para amplify, en caso de instalar las librerías y dependencias
      setLoading(true);
      setError("");
      
      try{
        await Auth.signUp({
          username: email,
          password,
          attributes:{
          email, name:username,
          },
        });

        alert("Registro exitoso. Revisa tu correo para confirmar");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      }catc(err){
        setError(err.message || "Hubo un error en el registro");
        console.error(err);
      }finally{
        setLoading(False);
      }



      ----- Para versión local ----
      try {
      const response = await fetch("http://localhost:8000/", { <---- URL para fecth el registro del backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registro exitoso. Por favor inicia sesión");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        setError(data.detail || "Error en el registro");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
    */
  };

  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLogin = () => {
    // navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Círculo morado superior izquierdo */}
      <div className="circle-purple-register"></div>

      {/* Círculo amarillo inferior derecho */}
      <div className="circle-yellow-register"></div>

      <div className="register-card">
        {/* Panel izquierdo - Información */}
        <div className="register-info-panel">
          <div className="info-content-register">
            <h2 className="info-title-register">
              Para crear
              <br />
              una cuenta,
              <br />
              llena los
              <br />
              siguientes
              <br />
              campos
            </h2>
            <button onClick={handleLogin} className="btn-login-redirect">
              Login
            </button>
          </div>
        </div>

        {/* Panel derecho - Formulario */}
        <div className="register-form-panel">
          <h1 className="register-title">
            <span className="title-re-register">Re</span>
            <span className="title-born-register">born</span>
          </h1>

          <div className="form-container-register">
            {/* Input Nombre de usuario */}
            <div className="input-wrapper-register">
              <svg
                className="input-icon-register"
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
                className="input-field-register"
              />
            </div>

            {/* Input Email */}
            <div className="input-wrapper-register">
              <svg
                className="input-icon-register"
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
                className="input-field-register"
              />
            </div>

            {/* Input Contraseña */}
            <div className="input-wrapper-register">
              <svg
                className="input-icon-register"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field-register"
              />
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="input-wrapper-register">
              <svg
                className="input-icon-register"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field-register"
              />
            </div>

            {/* Botones */}
            <div className="button-container-register">
              <button onClick={handleRegister} className="btn-register">
                Crear cuenta
              </button>
              <button onClick={handleCancel} className="btn-cancel-register">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}