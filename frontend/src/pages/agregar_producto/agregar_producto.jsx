/* 
    Autor: Ian Domínguez
    Fecha: 16 de noviembre de 2025
    Descripción: Muestra una vista para que el usuario pueda ingresar la información necesaria para crear un producto dentro de la plataforma.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import { productService } from '../../services/productService';
import "./agregar_producto.css";

export default function AgregarProducto() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    address: "",
    imagenes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Categoría ahora limitada a valores del sistema: 'producto' | 'material'

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getValidationError = () => {
    switch (currentStep) {
      case 1:
        if (formData.nombre.trim() === "") {
          return "Por favor, ingresa el nombre del producto";
        }
        break;
      case 2:
        if (formData.descripcion.trim() === "") {
          return "Por favor, añade una descripción del producto";
        }
        break;
      case 3:
        if (formData.precio === "" || parseFloat(formData.precio) <= 0) {
          return "Por favor, ingresa un precio válido";
        }
        break;
      case 4:
        if (formData.categoria === "") {
          return "Por favor, selecciona una categoría";
        }
        break;
      case 5:
        if (formData.stock === "" || parseInt(formData.stock) < 0) {
          return "Por favor, ingresa el stock disponible";
        }
        if (formData.address.trim() === "") {
          return "Por favor, ingresa la dirección / ubicación";
        }
        break;
      case 7:
        if (formData.imagenes.length === 0) {
          return "Por favor, sube al menos una imagen del producto";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.nombre.trim() !== "";
      case 2:
        return formData.descripcion.trim() !== "";
      case 3:
        return formData.precio !== "" && parseFloat(formData.precio) > 0;
      case 4:
        return formData.categoria !== "";
      case 5:
        return formData.stock !== "" && parseInt(formData.stock) >= 0 && formData.address.trim() !== "";
      case 7:
        return formData.imagenes.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const error = getValidationError();
    if (error) {
      setErrorMessage(error);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (currentStep < 8) {
      setErrorMessage("");
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.imagenes.length <= 5) {
      setFormData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, ...files],
      }));
    } else {
      alert("Máximo 5 imágenes permitidas");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await productService.createProduct(formData);
      navigate("/mi-cuenta/mis-productos");
    } catch (e) {
      setErrorMessage(e.message || 'Error al crear producto');
      setTimeout(()=> setErrorMessage(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-layout two-panels">
            <div className="left-panel">
              <h2 className="panel-question">
                ¿Cuál es el nombre de tu producto?
              </h2>
            </div>
            <div className="right-panel">
              <div className="content-card">
                <div className="input-container">
                  <svg
                    className="input-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Mi producto"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="form-input"
                  />
                </div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-layout two-panels">
            <div className="left-panel">
              <h2 className="panel-question">
                Añade la descripción del producto
              </h2>
              <button className="btn-back" onClick={handleBack}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="right-panel">
              <div className="content-card">
                <div className="input-container textarea-container">
                  <svg
                    className="input-icon textarea-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <textarea
                    placeholder="Descripción del producto"
                    value={formData.descripcion}
                    onChange={(e) =>
                      handleInputChange("descripcion", e.target.value)
                    }
                    className="form-textarea"
                  />
                </div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-layout two-panels">
            <div className="left-panel">
              <h2 className="panel-question">
                ¿Cuál es el precio de tu producto?
              </h2>
              <button className="btn-back" onClick={handleBack}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="right-panel">
              <div className="content-card">
                <div className="input-container">
                  <svg
                    className="input-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <input
                    type="number"
                    placeholder="$$$"
                    value={formData.precio}
                    onChange={(e) =>
                      handleInputChange("precio", e.target.value)
                    }
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-layout two-panels">
            <div className="left-panel">
              <h2 className="panel-question">Selecciona la categoría</h2>
              <button className="btn-back" onClick={handleBack}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="right-panel">
              <div className="content-card">
                <div className="radio-group" role="radiogroup" aria-label="Categoría del producto">
                  <label className={`radio-option ${formData.categoria === 'producto' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="categoria"
                      value="producto"
                      checked={formData.categoria === 'producto'}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                    />
                    <span className="radio-label">Producto</span>
                  </label>
                  <label className={`radio-option ${formData.categoria === 'material' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="categoria"
                      value="material"
                      checked={formData.categoria === 'material'}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                    />
                    <span className="radio-label">Material</span>
                  </label>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-layout two-panels">
            <div className="left-panel">
              <h2 className="panel-question">
                Ingresa el stock y dirección
              </h2>
              <button className="btn-back" onClick={handleBack}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="right-panel">
              <div className="content-card">
                <div className="input-container">
                  <svg
                    className="input-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                  <input
                    type="number"
                    placeholder="Stock [1,2,3,...]"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="input-container">
                  <svg
                    className="input-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l7 7-7 13-7-13 7-7z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Dirección / ubicación"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="form-input"
                  />
                </div>
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-layout full-panel">
            <div className="summary-panel">
              <button className="btn-back-floating left" onClick={handleBack}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="summary-card">
                <div className="summary-content">
                  <h2 className="summary-title">
                    Producto: {formData.nombre || "Nombre"}
                  </h2>
                  <p className="summary-item">
                    <span className="summary-label">Descripción:</span>{" "}
                    {formData.descripcion ||
                      "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi."}
                  </p>
                  <p className="summary-item">
                    <span className="summary-label">Precio:</span> $
                    {formData.precio || "123.45"}
                  </p>
                  <p className="summary-item">
                    <span className="summary-label">Categoría:</span>{" "}
                    {formData.categoria || "Lorem ipsum"}
                  </p>
                  <p className="summary-item">
                    <span className="summary-label">Stock:</span>{" "}
                    {formData.stock || "123"}
                  </p>
                  <p className="summary-item">
                    <span className="summary-label">Dirección:</span>{" "}
                    {formData.address || "Ubicación pendiente"}
                  </p>
                </div>
              </div>

              <button className="btn-next-floating right" onClick={handleNext}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="step-layout full-panel">
            <div className="upload-panel">
              <button className="btn-back-floating left" onClick={handleBack}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="upload-card">
                <h2 className="upload-title">
                  Sube las imágenes de tu producto
                </h2>

                <label className="upload-area">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 8L12 3L7 8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 3V15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </label>

                <p className="upload-notice">
                  <span className="notice-label">Aviso:</span> Máximo 5 imágenes
                </p>

                {formData.imagenes.length > 0 && (
                  <div className="images-preview">
                    <p className="images-count">
                      {formData.imagenes.length} imagen(es) seleccionada(s)
                    </p>
                    <div className="images-list">
                      {formData.imagenes.map((img, index) => (
                        <div key={index} className="image-item">
                          <span>{img.name}</span>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="remove-image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}

                <BtnGeneral
                  text="Siguiente"
                  color="amarillo"
                  onClick={handleNext}
                  className="btn-siguiente-general upload-btn"
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="step-layout full-panel">
            <div className="success-panel">
              <div className="success-card">
                <h2 className="success-message">
                  El producto se ha creado correctamente.
                  <br />
                  Ahora podrás verlo dentro de tu perfil.
                </h2>
                <BtnGeneral
                  text={isSubmitting ? 'Guardando...' : 'Finalizar'}
                  color="amarillo"
                  onClick={handleFinish}
                  className="btn-siguiente-general"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="agregar-producto-page">
      <Header /> 
      <div className="agregar-producto-container">
        {currentStep === 1 && (
          <h1 className="page-title">
            Agrega un <span className="title-highlight">producto</span>
          </h1>
        )}

        <div className="form-wrapper">{renderStepContent()}</div>
      </div>
      <Footer /> 
      {isSubmitting && <div className="loading-overlay">Guardando producto...</div>}
    </div>
  );
}
