import React from "react";
import { BtnCarrito } from "../../Botones/btn_carrito";
import { BtnGeneral } from "../../Botones/btn_general";
import "./cardProducto.css";

export const CardProducto = ({ 
  className = "",
  productName = "Chamarra de mezclilla bordada",
  artistName = "Alejandro Hernandez",
  price = "$799.99 mxn",
  imageUrl = "https://placehold.co/600x400",
  onViewDetails,
  onAddToCart,
  buttonText = "Ver detalles"
}) => {
  return (
    <div className={`card-producto ${className}`}>
      <div 
        className="product-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="product-info">
        <div className="product-details">
          <h3 className="product-name">{productName}</h3>
          <p className="artist-name">Artista: {artistName}</p>
          <p className="product-price">{price}</p>
        </div>
        <div className="product-buttons">
          <BtnGeneral
            className="btn-details"
            property1="default"
            text={buttonText}
            onClick={onViewDetails}
          />
          <BtnCarrito 
            className="btn-cart" 
            onClick={onAddToCart}
          />
        </div>
      </div>
    </div>
  );
};