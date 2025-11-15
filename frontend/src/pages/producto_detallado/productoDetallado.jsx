import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./productoDetallado.css";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 

export default function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();

  // Estados
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cargar datos del producto
  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    setLoading(true);

    // Aquí harías tu fetch a la API
    // const productResponse = await fetch(`/api/products/${productId}`);
    // const reviewsResponse = await fetch(`/api/products/${productId}/reviews?limit=1`);

    // Datos de ejemplo
    const mockProduct = {
      id: productId || 1,
      name: "Madera artesanal de 20 x 20 cm",
      price: 10.0,
      seller_id: 101,
      seller_name: "Alejandro Hernandez",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dui diam, maximus ut tellus in, sagittis accumsan lectus. Nulla lacinia sodales sem eu condimentum.\nDonec auctor sed diam ut mollis. Nunc cursus leo sed tincidunt hendrerit. Nam volutpat consectetur mi at varius.\nMaecenas feugiat arcu vel elit tempor vulputate. Nam quis tortor at sapien finibus varius.\nPellentesque et hendrerit tortor, id feugiat felis. Nullam in nulla id neque mollis mollis at vitae libero.",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
      ],
    };

    const mockReviews = [
      {
        review_id: 1,
        user_id: 201,
        username: "Nombre de usuario",
        user_avatar: "https://via.placeholder.com/40",
        rating: 4,
        title: "Título",
        comment:
          "orem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacus nibh, dignissim non ex et, fringilla iaculis erat. Phasellus scelerisque dui et tortor commodo, at dictum mi placerat. Phasellus pharetra laoreet odio, non aliquet purus posuere a. Nulla lobortis lobortis elit sed vehicula. Mauris hendrerit libero in quam imperdiet placerat.",
        images: [
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=150&h=150&fit=crop",
          "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=150&h=150&fit=crop",
        ],
        date: "2025-01-15",
      },
    ];

    setProduct(mockProduct);
    setReviews(mockReviews);
    setTotalReviews(123);
    setAverageRating(4);
    setLoading(false);
  };

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
    console.log("Comprar producto:", product.id);
    navigate(`/checkout/${product.id}`);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    console.log("Agregar al carrito:", product.id);
    // Implementar lógica de agregar al carrito
  };

  // Ver todas las reseñas
  const handleViewAllReviews = () => {
    navigate(`/product/${product.id}/reviews`);
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

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error-container">Producto no encontrado</div>
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
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${
                    index === selectedImage ? "thumbnail-active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} - ${index + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-details">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-seller">Vendedor: {product.seller_name}</p>
            <p className="product-price">${product.price.toFixed(2)} mxn</p>

            <div className="product-description">
              <p className="description-label">Descripción:</p>
              <p className="description-text">{product.description}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="product-actions-buttons">
            <BtnGeneral
              property1="variant-2"
              color="amarillo"
              text="Comprar"
              onClick={handleBuy}
              className="btn-action-product"
            />
            <BtnGeneral
              property1="default"
              color="morado"
              text="Agregar al carrito"
              onClick={handleAddToCart}
              className="btn-action-product"
            />
          </div>
        </div>

        {/* Sección de reseñas */}
        <div className="reviews-section">
          {/* Resumen de reseñas */}
          <div className="reviews-summary-card">
            <h2 className="reviews-summary-title">
              Reseñas de clientes ({totalReviews})
            </h2>
            <p className="reviews-summary-subtitle">Calificación promedio</p>
            <div className="reviews-average-stars">
              {renderStars(averageRating, "large")}
            </div>
            <button
              className="view-all-reviews-btn"
              onClick={handleViewAllReviews}
            >
              Ver todas las reseñas &gt;
            </button>
          </div>

          {/* Preview de reseña */}
          {reviews.length > 0 && (
            <div className="review-preview">
              <div className="review-preview-header">
                <img
                  src={reviews[0].user_avatar}
                  alt={reviews[0].username}
                  className="review-user-avatar"
                />
                <span className="review-username">{reviews[0].username}</span>
              </div>

              <div className="review-preview-rating">
                {renderStars(reviews[0].rating, "small")}
              </div>

              <h4 className="review-preview-title">{reviews[0].title}</h4>

              <p className="review-preview-comment">{reviews[0].comment}</p>

              {reviews[0].images && reviews[0].images.length > 0 && (
                <div className="review-preview-images">
                  {reviews[0].images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Reseña imagen ${index + 1}`}
                      className="review-image"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
