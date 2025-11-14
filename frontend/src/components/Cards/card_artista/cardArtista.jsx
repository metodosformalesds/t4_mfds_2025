import React from "react";
import { BtnGeneral } from "../../Botones/btn_general";
import "./cardArtista.css";

/**
 * Erick Rangel 234591
 * Componente CardArtista 
 * Muestra la información de un artista
 
 className - Clases CSS adicionales
 artistName - Nombre del artista
 Especialidad del artista
 URL de la imagen del artista
 Función al hacer clic en "Ver perfil"
 Texto del botón (opcional)
*/

export const CardArtista = ({ 
  className = "",
  artistName = "Eduardo Muñoz",
  specialty = "Madera y bordados",
  imageUrl = "https://placehold.co/600x400",
  onViewProfile,
  buttonText = "Ver perfil"
}) => {
  return (
    <div className={`card-artista ${className}`}>
      {/* Imagen del artista */}
      <div 
        className="artist-image" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Información del artista */}
      <div className="artist-info">
        <div className="artist-details">
          <h3 className="artist-name">{artistName}</h3>
          <p className="artist-specialty">Especialista en: {specialty}</p>
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