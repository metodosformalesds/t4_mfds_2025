import React, { useState } from 'react';
import './CreateReviewStyles.css';

// Header y Footer
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 

export default function WriteReview({ productId, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (selectedRating) => {
    setHoveredRating(selectedRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    // Validación
    if (rating === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }
    if (!title.trim()) {
      alert('Por favor, ingresa un título');
      return;
    }
    if (!comment.trim()) {
      alert('Por favor, ingresa una descripción');
      return;
    }

    // Datos de la reseña
    const reviewData = {
      product_id: productId,
      rating: rating,
      title: title.trim(),
      comment: comment.trim(),
      date: new Date().toISOString()
    };

    console.log('Enviando reseña:', reviewData);
    
    // Llamar a la función onSubmit si existe
    if (onSubmit) {
      onSubmit(reviewData);
    }

    // Aquí harías tu POST a la API
    // await fetch('/api/reviews', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reviewData)
    // });
  };

  const handleCancel = () => {
    // Limpiar formulario
    setRating(0);
    setTitle('');
    setComment('');
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="write-review-page">
      {/* Header Component */}
      <Header />

      <div className="write-review-container">
        <div className="review-form-card">
          {/* Título principal */}
          <h2 className="form-title">¿Qué te pareció el producto?</h2>

          {/* Sistema de estrellas interactivo */}
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${
                  star <= (hoveredRating || rating) ? 'star-active' : 'star-inactive'
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                aria-label={`${star} estrellas`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Input de título */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Ingresa un título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-title"
              maxLength={100}
            />
          </div>

          {/* Textarea de descripción */}
          <div className="form-group">
            <textarea
              placeholder="Ingresa una descripción"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-description"
              rows={8}
              maxLength={1000}
            />
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-cancel-review"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn-submit-review"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}