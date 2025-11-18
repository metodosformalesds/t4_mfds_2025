/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: productoDetallado.jsx
 * Descripción: Página de detalle de producto que muestra información completa, galería de imágenes,
 *              calificaciones, reseñas y opciones de compra (checkout o agregar al carrito).
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import { useProductDetail } from '../../hooks/useProductDetail';
import favoriteService from '../../services/favoriteService';
import reviewService from '../../services/reviewService';
import "./productoDetallado.css";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [latestReview, setLatestReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  const { 
    product, 
    loading, 
    error, 
    selectedImage, 
    handleImageSelect,
    hasImages 
  } = useProductDetail(productId);

  useEffect(() => {
    if (product) {
      checkIfFavorite();
      fetchReviews();
    }
  }, [product]);

  /*
    Autor: Erick Rangel

    Descripción: 
    Verifica si el producto actual está en la lista de favoritos del usuario.

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const checkIfFavorite = async () => {
    try {
      const favorites = await favoriteService.getFavoriteProducts();
      const isFav = favorites.some(fav => fav.product.id === parseInt(productId));
      setIsFavorite(isFav);
    } catch (error) {
          }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Obtiene las reseñas del producto y guarda la más reciente para preview.

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviews = await reviewService.getProductReviews(productId);
      if (reviews && reviews.length > 0) {
        const sortedReviews = reviews.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setLatestReview(sortedReviews[0]);
      }
    } catch (error) {
          } finally {
      setReviewsLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Renderiza las estrellas de calificación del producto.

    Parámetros:
    rating - number: Calificación del 1 al 5
    size - string: Tamaño de las estrellas ('small', 'medium', 'large')

    Retorna:
    Array<JSX.Element> - Array de elementos de estrellas
  */
  const renderStars = (rating, size = "medium") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star-product star-${size} ${
            i <= rating ? "star-filled-product" : "star-empty-product"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Navega directamente al checkout con el producto actual.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleBuy = () => {
    if (!product) return;
        navigate(`/checkout/${product.id}`);
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Agrega el producto al carrito. (Funcionalidad pendiente de implementar)

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleAddToCart = () => {
    if (!product) return;
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Agrega o remueve el producto de favoritos.

    Parámetros:
    Ninguno

    Retorna:
    Promise<void>
  */
  const handleToggleFavorite = async () => {
    if (!product) return;
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavoriteProduct(product.id);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavoriteProduct(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
          } finally {
      setFavoriteLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: 
    Navega a la página de todas las reseñas del producto.

    Parámetros:
    Ninguno

    Retorna:
    void
  */
  const handleViewAllReviews = () => {
    if (!product) return;
    navigate(`/producto/${product.id}/resenas`);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading-container">Cargando producto...</div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error-container">
          {error || "Producto no encontrado"}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />

      <div className="product-detail-container">
        {/* Sección principal del producto */}
        <div className="product-main-section">
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="thumbnail-list">
              {hasImages && product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${
                    index === selectedImage ? "thumbnail-active" : ""
                  }`}
                  onClick={() => handleImageSelect(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image">
              {hasImages ? (
                <img src={product.images[selectedImage]} alt={product.name} />
              ) : (
                <div className="no-image-placeholder">
                  Imagen no disponible
                </div>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-details">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-seller">
              Vendedor: {product.user?.full_name || 'Artista'}
            </p>
            <p className="product-price">${parseFloat(product.price).toFixed(2)} mxn</p>

            <div className="product-description">
              <p className="description-label">Descripción:</p>
              <p className="description-text">{product.description}</p>
            </div>

            {/* Rating del producto */}
            <div className="product-rating">
              <div className="rating-stars">
                {renderStars(product.average_rating || 0, "medium")}
              </div>
              <span className="rating-text">
                ({product.review_count || 0} reseñas)
              </span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="product-actions-buttons">
            <BtnGeneral
              property1="default"
              color="amarillo"
              text="Comprar"
              onClick={handleBuy}
              className="btn-action-product"
            />
            <BtnGeneral
              property1="variant-2"
              color="morado"
              text="Agregar al carrito"
              onClick={handleAddToCart}
              className="btn-action-product"
            />
            <BtnGeneral
              property1={isFavorite ? "default" : "variant-2"}
              color="rosa"
              text={isFavorite ? "Favorito" : "Agregar a favoritos"}
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className="btn-action-product"
            />
          </div>
        </div>

        {/* Sección de reseñas (simplificada por ahora) */}
        <div className="reviews-section">
          <div className="reviews-summary-card">
            <h2 className="reviews-summary-title">
              Reseñas de clientes ({product.review_count || 0})
            </h2>
            <p className="reviews-summary-subtitle">Calificación promedio</p>
            <div className="reviews-average-stars">
              {renderStars(product.average_rating || 0, "large")}
            </div>
            <button
              className="view-all-reviews-btn"
              onClick={handleViewAllReviews}
            >
              Ver todas las reseñas &gt;
            </button>
          </div>

          {/* Preview de reseña más reciente */}
          {reviewsLoading ? (
            <div className="review-preview">
              <p>Cargando reseñas...</p>
            </div>
          ) : latestReview ? (
            <div className="review-preview">
              <div className="review-preview-header">
                {latestReview.reviewer?.profile_picture ? (
                  <img 
                    src={latestReview.reviewer.profile_picture} 
                    alt={latestReview.reviewer.full_name}
                    className="review-user-avatar"
                  />
                ) : (
                  <div className="review-user-avatar">
                    {latestReview.reviewer?.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="review-username">
                  {latestReview.reviewer?.full_name || 'Usuario'}
                </span>
              </div>
              <div className="review-preview-rating">
                {renderStars(latestReview.rating, "small")}
              </div>
              <h3 className="review-preview-title">{latestReview.title}</h3>
              <p className="review-preview-comment">{latestReview.comment}</p>
            </div>
          ) : (
            <div className="review-preview">
              <p>Aún no hay reseñas para este producto</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}