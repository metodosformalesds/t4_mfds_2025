/* 
  Autor: Ian Domínguez - Erick Rangel
  Fecha: 12 de noviembre de 2025
  Componente: Ver reseñas de un producto
  Descripción: Vista para todas las reseñas de diferentes usuarios sobre un producto.

*/


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './resenasProducto.css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import reviewService from '../../services/reviewService'; 

export default function ProductReviews() {
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      
      if (data && data.length > 0) {
        setReviews(data);
        setTotalReviews(data.length);
        
        // Calcular rating promedio
        const total = data.reduce((sum, review) => sum + review.rating, 0);
        const avg = total / data.length;
        setAverageRating(avg);
      } else {
        setReviews([]);
        setTotalReviews(0);
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="reviews-list">
            <p style={{ textAlign: 'center', color: '#666' }}>Cargando reseñas...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-list">
            <p style={{ textAlign: 'center', color: '#666' }}>No hay reseñas aún para este producto</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                {/* Header de la reseña */}
                <div className="review-header">
                  {review.reviewer?.profile_picture ? (
                    <img 
                      src={review.reviewer.profile_picture} 
                      alt={review.reviewer.full_name}
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar">
                      {review.reviewer?.full_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="username">{review.reviewer?.full_name || 'Usuario'}</span>
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
                <p className="review-date">{formatDate(review.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}