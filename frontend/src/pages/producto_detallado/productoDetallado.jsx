import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import { useProductDetail } from '../../hooks/useProductDetail';
import "./productoDetallado.css";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  // Usar hook personalizado para manejar el estado del producto
  const { 
    product, 
    loading, 
    error, 
    selectedImage, 
    handleImageSelect,
    hasImages 
  } = useProductDetail(productId);

  // Función para renderizar estrellas
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

  // Manejar compra
  const handleBuy = () => {
    if (!product) return;
    console.log("Comprar producto:", product.id);
    navigate(`/checkout/${product.id}`);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;
    console.log("Agregar al carrito:", product.id);
    // TODO: Implementar lógica de agregar al carrito cuando esté listo
  };

  // Ver todas las reseñas
  const handleViewAllReviews = () => {
    if (!product) return;
    navigate(`/product/${product.id}/reviews`);
  };

  // Estados de carga y error
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

          {/* TODO: Implementar preview de reseñas  */}
          <div className="review-preview">
            <p>proximamente...</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}