import React from "react";
import { useNavigate } from "react-router-dom";
import { BtnCarrito } from "../../Botones/btn_carrito";
import { BtnGeneral } from "../../Botones/btn_general";
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
}) => {
  const navigate = useNavigate(); 

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

  return (
    <div className={`card-producto ${className}`}>
      {/* Imagen del producto */}
      <div 
        className="product-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={handleImageClick} // Click en imagen manda a detalles
      />
      
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
                  ⭐ {calificacion.toFixed(1)}
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