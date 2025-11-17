/**
 Autor: Erick Rangel 
 Fecha: 12-11-2025
 Componente: CardArtista 
 Muestra la información de un artista
*/

import React, { useState } from "react";
import { BtnGeneral } from "../../Botones/btn_general";
import favoriteService from "../../../services/favoriteService";
import "./cardArtista.css";

export const CardArtista = ({ 
  className = "",
  artistName = "Eduardo Muñoz",
  imageUrl = "https://placehold.co/600x400",
  onViewProfile,
  buttonText = "Ver perfil",
  artistId,
  isFavorite = false,
  onFavoriteChange,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    setFavoriteLoading(true);
    try {
      if (favorite) {
        // Quitar de favoritos
        await favoriteService.removeFavoriteArtist(artistId);
        setFavorite(false);
      } else {
        // Agregar a favoritos
        await favoriteService.addFavoriteArtist(artistId);
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
    <div className={`card-artista ${className}`}>
      {/* Imagen del artista */}
      <div 
        className="artist-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
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
      
      {/* Información del artista */}
      <div className="artist-info">
        <div className="artist-details">
          <h3 className="artist-name">{artistName}</h3>
        </div>
        
        {/* Botones */}
        <div className="artist-buttons">
          <BtnGeneral
            className="view-profile-btn"
            property1="variant-2"
            text={buttonText}
            onClick={onViewProfile}
            color="morado"
          />
        </div>
      </div>
    </div>
  );
};