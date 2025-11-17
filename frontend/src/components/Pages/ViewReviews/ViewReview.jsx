/* 
  Autor: Ian Domínguez
  Fecha: 12 de noviembre de 2025
  Componente: Ver reseñas de un producto
  Descripción: Vista para todas las reseñas de diferentes usuarios sobre un producto.

*/


import React, { useState, useEffect } from 'react';
import './ViewReviewStyles.css';

// Header y Footer
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 

export default function ProductReviews({ productId }) {
  // Estado para las reseñas
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Simulación de datos - En producción, esto vendría de tu API
  useEffect(() => {
    // Aquí harías tu fetch a la API
    // const response = await fetch(`/api/products/${productId}/reviews`);
    // const data = await response.json();
    
    // Datos de ejemplo basados en el modelo de base de datos
    const mockReviews = [
      {
        review_id: 1,
        product_id: productId,
        user_id: 101,
        username: "Nombre de usuario",
        user_avatar: "https://via.placeholder.com/40",
        rating: 4,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus nibh, dignissim non ex et, fringilla iaculis erat. Phasellus scelerisque dui et tortor commodo, at dictum mi placerat. Phasellus pharetra laoreet odio, non aliquet purus posuere a. Nulla lobortis lobortis elit sed vehicula. Mauris hendrerit libero in quam imperdiet placerat.",
        title: "Título",
        date: "2025-01-15"
      },
      {
        review_id: 2,
        product_id: productId,
        user_id: 102,
        username: "Nombre de usuario",
        user_avatar: "https://via.placeholder.com/40",
        rating: 5,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus nibh, dignissim non ex et, fringilla iaculis erat. Phasellus scelerisque dui et tortor commodo, at dictum mi placerat. Phasellus pharetra laoreet odio, non aliquet purus posuere a. Nulla lobortis lobortis elit sed vehicula. Mauris hendrerit libero in quam imperdiet placerat.",
        title: "Título",
        date: "2025-01-14"
      },
      {
        review_id: 3,
        product_id: productId,
        user_id: 103,
        username: "Nombre de usuario",
        user_avatar: "https://via.placeholder.com/40",
        rating: 4,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus nibh, dignissim non ex et, fringilla iaculis erat. Phasellus scelerisque dui et tortor commodo, at dictum mi placerat. Phasellus pharetra laoreet odio, non aliquet purus posuere a. Nulla lobortis lobortis elit sed vehicula. Mauris hendrerit libero in quam imperdiet placerat.",
        title: "Título",
        date: "2025-01-13"
      }
    ];

    setReviews(mockReviews);
    setTotalReviews(mockReviews.length);
    
    // Calcular rating promedio
    const total = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    const avg = total / mockReviews.length;
    setAverageRating(avg);
  }, [productId]);

  // Función para renderizar estrellas
  const renderStars = (rating, size = 'medium') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className={`star star-${size} star-filled`}>
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className={`star star-${size} star-half`}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className={`star star-${size} star-empty`}>
            ★
          </span>
        );
      }
    }
    return stars;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="reviews-page">
      {/* Header Component */}
      <Header />

      <div className="reviews-container">
        {/* Sección de resumen de reseñas */}
        <div className="reviews-summary">
          <h2 className="reviews-title">Reseñas de clientes ({totalReviews})</h2>
          <p className="reviews-subtitle">Calificación promedio</p>
          <div className="average-rating">
            {renderStars(averageRating, 'large')}
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="divider"></div>

        {/* Título de todas las reseñas */}
        <h3 className="all-reviews-title">Todas las reseñas</h3>

        {/* Lista de reseñas */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.review_id} className="review-card">
              {/* Header de la reseña */}
              <div className="review-header">
                <img 
                  src={review.user_avatar} 
                  alt={review.username}
                  className="user-avatar"
                />
                <span className="username">{review.username}</span>
              </div>

              {/* Rating de la reseña */}
              <div className="review-rating">
                {renderStars(review.rating, 'small')}
              </div>

              {/* Título de la reseña */}
              <h4 className="review-title">{review.title}</h4>

              {/* Comentario de la reseña */}
              <p className="review-comment">{review.comment}</p>

              {/* Fecha de la reseña */}
              <p className="review-date">{formatDate(review.date)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}