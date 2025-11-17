/* 
  Autor: Ian Luis Domínguez Ramírez 222611
  Fecha: 12 de noviembre de 2025
  Descripción: La vista de Crear reseñas, sirve para que cuando un usuario desee realizar una reseña de un producto, esta página se muestra para que el usuario pueda ingresar la información necesaria y dar una calificación. 
*/


import React, { useState } from 'react';
import './crearResena.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BtnGeneral } from '../../components/Botones/btn_general';
import reviewService from '../../services/reviewService';
import { useProductDetail } from '../../hooks/useProductDetail';

export default function WriteReview() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const { orderId, productId } = useParams();
  const navigate = useNavigate();
  const { product } = useProductDetail(productId);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleStarHover = (selectedRating) => {
    setHoveredRating(selectedRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
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

    const reviewData = {
      product_id: Number(productId),
      order_id: Number(orderId),
      rating,
      title: title.trim(),
      comment: comment.trim(),
    };

    try {
      await reviewService.createReview(reviewData);
      alert('¡Reseña enviada!');
      navigate('/mi-cuenta/mis-pedidos');
    } catch (err) {
      alert(err?.message || 'No se pudo enviar la reseña');
      console.error('Error creating review:', err);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setTitle('');
    setComment('');
    navigate(-1);
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

          {/* Información del producto */}
          {product && (
            <div className="product-info-review">
              <div className="product-image-review">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} 
                  alt={product.name}
                />
              </div>
              <div className="product-details-review">
                <h3 className="product-name-review">{product.name}</h3>
                <p className="product-seller-review">
                  Vendedor: {product.user?.full_name || 'Artista'}
                </p>
                <p className="product-description-review">{product.description}</p>
              </div>
            </div>
          )}

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
            <BtnGeneral
              text="Cancelar"
              onClick={handleCancel}
              color="morado"
              className="btn-cancel-review"
            />
            <BtnGeneral
              text="Enviar"
              onClick={handleSubmit}
              color="amarillo"
              className="btn-submit-review"
            />
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}