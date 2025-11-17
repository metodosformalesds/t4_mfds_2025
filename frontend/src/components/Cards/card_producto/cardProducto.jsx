/**
 Autor: Erick Rangel 
 Fecha: 12-11-2025
 Componente: CardProducto
 Muestra la información de un producto
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BtnCarrito } from "../../Botones/btn_carrito";
import { BtnGeneral } from "../../Botones/btn_general";
import favoriteService from "../../../services/favoriteService";
import "./cardProducto.css";

/**
 * Componente CardProducto - Muestra un producto individual
 * @param {Object} props - Props del componente
 * @param {string} props.productName - Nombre del producto
 * @param {string} props.artistName - Nombre del artista/proveedor
 * @param {string} props.price - Precio formateado
 * @param {string} props.imageUrl - URL de la imagen
 * @param {function} props.onViewDetails - Función al ver detalles (opcional)
 * @param {function} props.onAddToCart - Función al agregar al carrito
 * @param {string} props.buttonText - Texto del botón
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.reseñas - Número de reseñas
 * @param {number} props.calificacion - Calificación promedio
 * @param {boolean} props.isMaterial - Si es material (cambia el texto)
 * @param {number|string} props.productId - ID del producto para navegación
 * @param {boolean} props.isFavorite - Si el producto está en favoritos
 * @param {function} props.onFavoriteChange - Callback cuando cambia el estado de favorito
 */
export const CardProducto = ({
  productName = "Producto",
  artistName = "Artista",
  price = "$0.00 mxn",
  imageUrl = "./IMG.png",
  onViewDetails, 
  onAddToCart,
  buttonText = "Ver detalles",
  className = "",
  reseñas = 0,
  calificacion = 0,
  isMaterial = false,
  productId,
  isFavorite = false,
  onFavoriteChange,
}) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Función para manejar la navegación al producto detallado
  const handleViewDetails = () => {
    if (onViewDetails) {
      // Si hay una función personalizada, usarla
      onViewDetails();
    } else if (productId) {
      // Navegar al producto detallado
      navigate(`/producto/${productId}`);
    }
  };

  // Manejar click en la imagen
  const handleImageClick = () => {
    handleViewDetails();
  };

  // Manejar favorito
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    setFavoriteLoading(true);
    try {
      if (favorite) {
        // Quitar de favoritos
        await favoriteService.removeFavoriteProduct(productId);
        setFavorite(false);
      } else {
        // Agregar a favoritos
        await favoriteService.addFavoriteProduct(productId);
        setFavorite(true);
      }
      // Notificar al padre del cambio
      if (onFavoriteChange) {
        onFavoriteChange(!favorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className={`card-producto ${className}`}>
      {/* Imagen del producto */}
      <div 
        className="product-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={handleImageClick} // Click en imagen manda a detalles
      />

      {/* Botón de favorito */}
      <button
        className={`btn-favorite-card ${favorite ? 'is-favorite' : ''}`}
        onClick={handleToggleFavorite}
        disabled={favoriteLoading}
        aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <svg
          className="heart-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      
      {/* Información del producto */}
      <div className="product-info">
        <div className="product-details">
          <h3 className="product-name" title={productName}>
            {productName}
          </h3>
          <p className="artist-name" title={artistName}>
            {isMaterial ? `Proveedor: ${artistName}` : `Artista: ${artistName}`}
          </p>
          
          {/* Métricas del producto */}
          {(reseñas > 0 || calificacion > 0) && (
            <div className="producto-metricas">
              {calificacion > 0 && (
                <span className="calificacion">
                  <span>
                    ★
                  </span>
                </span>
              )}
              {reseñas > 0 && (
                <span className="reseñas">
                  ({reseñas} {reseñas === 1 ? 'reseña' : 'reseñas'})
                </span>
              )}
            </div>
          )}
          
          <p className="product-price">{price}</p>
        </div>
        
        {/* Botones de acción */}
        <div className="product-buttons">
          <BtnGeneral
            className="btn-details"
            property1="default"
            text={buttonText}
            onClick={handleViewDetails} 
            color="morado"
          />
          <BtnCarrito 
            className="btn-cart" 
            onClick={onAddToCart}
            productId={productId} // Pasar el ID del producto
            showCount={false} // No mostrar contador en las cards
          />
        </div>
      </div>
    </div>
  );
};