/* 
    Autor: Ian Domínguez
    Fecha: 13 de noviembre de 2025
    Componente: Vista de artistas favoritos
    Descripción: Esta vista muestra los artistas favoritos guardados por el usuario mediante paginación.

*/

import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import './styles.css';

import Header from './components/Header/Header';  
import Footer from './components/Footer/Footer';  

export default function FavoriteArtists({ userId }) {
  //const navigate = useNavigate();
  
  // Estados
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const ARTISTS_PER_PAGE = 10;

  // Cargar artistas favoritos
  useEffect(() => {
    fetchFavoriteArtists(currentPage);
  }, [currentPage, userId]);

  const fetchFavoriteArtists = async (page) => {
    setLoading(true);
    
    // Aquí harías tu fetch a la API
    // const response = await fetch(`/api/users/${userId}/favorite-artists?page=${page}&limit=${ARTISTS_PER_PAGE}`);
    // const data = await response.json();
    
    // Datos de ejemplo basados en tu modelo de BD (User con Role = "Artista")
    const mockArtists = [
      {
        user_id: 101,
        name: "Eduardo Muñós",
        specialty: "Madera y bordados",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
      },
      {
        user_id: 102,
        name: "Eduardo Muñós",
        specialty: "Madera y bordados",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
      },
      {
        user_id: 103,
        name: "Eduardo Muñós",
        specialty: "Madera y bordados",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
      }
    ];

    setFavoriteArtists(mockArtists);
    setTotalPages(4); // Simular 4 páginas
    setLoading(false);
  };

  // Quitar de favoritos
  const removeFavorite = async (artistId) => {
    try {
      // Aquí harías tu DELETE a la API
      // await fetch(`/api/users/${userId}/favorite-artists/${artistId}`, {
      //   method: 'DELETE'
      // });

      console.log('Eliminando artista de favoritos:', artistId);
      
      // Actualizar estado local inmediatamente
      setFavoriteArtists(prev => 
        prev.filter(artist => artist.user_id !== artistId)
      );
      
      // Si la página queda vacía y no es la primera, ir a la anterior
      if (favoriteArtists.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error al quitar de favoritos:', error);
    }
  };

  // Ver perfil del artista
  const viewProfile = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  // Navegación a productos favoritos
  const goToFavoriteProducts = () => {
    navigate('/favorites/products');
  };

  // Cambiar página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generar números de página
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number-artist ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="favorites-artists-page">
      {/* Header Component */}
      <Header />

      <div className="favorites-artists-container">
        {/* Breadcrumb */}
        <div className="breadcrumb-artist">
          <span><strong>Mi cuenta</strong></span>
          <span className="breadcrumb-separator-artist">{'>'}</span>
          <span>Mis favoritos</span>
        </div>

        {/* Tabs de navegación */}
        <div className="favorites-tabs-artist">
          <button 
            className="tab-button-artist"
            onClick={goToFavoriteProducts}
          >
            Productos
          </button>
          <button className="tab-button-artist tab-active-artist">
            Artistas
          </button>
        </div>

        {/* Lista de artistas */}
        <div className="artists-list">
          {loading ? (
            <div className="loading-artist">Cargando...</div>
          ) : favoriteArtists.length === 0 ? (
            <div className="no-favorites-artist">
              <p>No tienes artistas favoritos aún</p>
            </div>
          ) : (
            favoriteArtists.map((artist) => (
              <div key={artist.user_id} className="artist-card">
                {/* Imagen del artista */}
                <div className="artist-image-container">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="artist-image"
                  />
                </div>

                {/* Información del artista */}
                <div className="artist-info">
                  <h3 className="artist-name">{artist.name}</h3>
                  <p className="artist-specialty">Especialista en: {artist.specialty}</p>
                  
                  <div className="artist-actions">
                    <button
                      className="btn-view-profile"
                      onClick={() => viewProfile(artist.user_id)}
                    >
                      Ver perfil
                    </button>
                  </div>
                </div>

                {/* Botón de favorito */}
                <button
                  className="btn-favorite-artist"
                  onClick={() => removeFavorite(artist.user_id)}
                  aria-label="Quitar de favoritos"
                >
                  <svg
                    className="heart-icon-artist"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination-artist">
            {renderPageNumbers()}
          </div>
        )}
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}