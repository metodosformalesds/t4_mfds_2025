/* 
    Autor: Ian Domínguez - Erick Rangel
    Fecha: 12 de noviembre de 2025
    Descripción: Página unificada de favoritos - productos y artistas con tabs
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import favoriteService from '../../../services/favoriteService';
import './Favorites.css';

/*
  Autor: Erick Rangel

  Descripción: Componente que muestra los productos y artistas favoritos del usuario con navegación por tabs y paginación.

  Parámetros: Ninguno

  Retorna: JSX.Element - Página de favoritos con tabs para productos y artistas
*/
export default function Favorites() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [currentPageArtists, setCurrentPageArtists] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchAllFavorites();
  }, []);

  /*
    Autor: Erick Rangel

    Descripción: Obtiene todos los productos y artistas favoritos del usuario desde el servidor.

    Parámetros: Ninguno

    Retorna: Promise<void>
  */
  const fetchAllFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await favoriteService.getFavoriteProducts();
      const artists = await favoriteService.getFavoriteArtists();
      
      setFavoriteProducts(Array.isArray(products) ? products : []);
      setFavoriteArtists(Array.isArray(artists) ? artists : []);
    } catch (err) {
            setError('Error al cargar favoritos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Elimina un producto de la lista de favoritos.

    Parámetros:
    - productId (number): ID del producto a eliminar

    Retorna: Promise<void>
  */
  const removeFavoriteProduct = async (productId) => {
    try {
      await favoriteService.removeFavoriteProduct(productId);
      setFavoriteProducts(prev => 
        prev.filter(fav => fav.product.id !== productId)
      );
    } catch (err) {
            setError('Error al eliminar de favoritos');
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Elimina un artista de la lista de favoritos.

    Parámetros:
    - artistId (number): ID del artista a eliminar

    Retorna: Promise<void>
  */
  const removeFavoriteArtist = async (artistId) => {
    try {
      await favoriteService.removeFavoriteArtist(artistId);
      setFavoriteArtists(prev => 
        prev.filter(fav => fav.artist.id !== artistId)
      );
    } catch (err) {
            setError('Error al eliminar de favoritos');
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de detalle del producto.

    Parámetros:
    - productId (number): ID del producto

    Retorna: void
  */
  const viewProduct = (productId) => {
    navigate(`/producto/${productId}`);
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de perfil del artista.

    Parámetros:
    - artistId (number): ID del artista

    Retorna: void
  */
  const viewArtistProfile = (artistId) => {
    navigate(`/artista/${artistId}`);
  };

  const productsPages = Math.ceil(favoriteProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = favoriteProducts.slice(
    (currentPageProducts - 1) * ITEMS_PER_PAGE,
    currentPageProducts * ITEMS_PER_PAGE
  );

  const artistsPages = Math.ceil(favoriteArtists.length / ITEMS_PER_PAGE);
  const paginatedArtists = favoriteArtists.slice(
    (currentPageArtists - 1) * ITEMS_PER_PAGE,
    currentPageArtists * ITEMS_PER_PAGE
  );

  /*
    Autor: Erick Rangel

    Descripción: Renderiza los botones de número de página para la paginación.

    Parámetros:
    - currentPage (number): Página actual
    - totalPages (number): Total de páginas
    - setPageFn (function): Función para cambiar la página

    Retorna: JSX.Element[] - Array de botones de página
  */
  const renderPageNumbers = (currentPage, totalPages, setPageFn) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => setPageFn(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="favorites-page">
      <Header />

      <div className="favorites-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </span>
          {" > "} Mis favoritos
        </div>

        {/* Tabs de navegación */}
        <div className="favorites-tabs">
          <button
            className={`tab-button ${activeTab === 'products' ? 'tab-active' : ''}`}
            onClick={() => {
              setActiveTab('products');
              setCurrentPageProducts(1);
            }}
          >
            Productos
          </button>
          <button
            className={`tab-button ${activeTab === 'artists' ? 'tab-active' : ''}`}
            onClick={() => {
              setActiveTab('artists');
              setCurrentPageArtists(1);
            }}
          >
            Artistas
          </button>
        </div>

        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading state */}
        {loading ? (
          <div className="loading">Cargando tus favoritos...</div>
        ) : (
          <>
            {/* TAB: PRODUCTOS FAVORITOS */}
            {activeTab === 'products' && (
              <div className="tab-content">
                {favoriteProducts.length === 0 ? (
                  <div className="no-favorites">
                    <p>No tienes productos favoritos aún</p>
                  </div>
                ) : (
                  <>
                    <div className="items-list">
                      {paginatedProducts.map((fav) => (
                        <div key={fav.id} className="item-card product-card">
                          {/* Imagen del producto */}
                          <div className="item-image-container">
                            <img
                              src={fav.product.images?.[0] || 'https://via.placeholder.com/200'}
                              alt={fav.product.name}
                              className="item-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200';
                              }}
                            />
                          </div>

                          {/* Información del producto */}
                          <div className="item-info">
                            <h3 className="item-name">{fav.product.name}</h3>
                            <p className="item-artist">
                              Artista: {fav.product.user?.full_name || 'Desconocido'}
                            </p>
                            <p className="item-price">
                              ${fav.product.price?.toFixed(2) || '0.00'} MXN
                            </p>

                            <div className="item-actions">
                              <button
                                className="btn-view-item"
                                onClick={() => viewProduct(fav.product.id)}
                              >
                                Ver producto
                              </button>
                            </div>
                          </div>

                          {/* Botón de favorito */}
                          <button
                            className="btn-favorite"
                            onClick={() => removeFavoriteProduct(fav.product.id)}
                            aria-label="Quitar de favoritos"
                          >
                            <svg
                              className="heart-icon"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Paginación productos */}
                    {productsPages > 1 && (
                      <div className="pagination">
                        {renderPageNumbers(currentPageProducts, productsPages, setCurrentPageProducts)}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB: ARTISTAS FAVORITOS */}
            {activeTab === 'artists' && (
              <div className="tab-content">
                {favoriteArtists.length === 0 ? (
                  <div className="no-favorites">
                    <p>No tienes artistas favoritos aún</p>
                  </div>
                ) : (
                  <>
                    <div className="items-list">
                      {paginatedArtists.map((fav) => (
                        <div key={fav.id} className="item-card artist-card">
                          {/* Imagen del artista */}
                          <div className="item-image-container">
                            <img
                              src={fav.artist.profile_picture || 'https://via.placeholder.com/200'}
                              alt={fav.artist.full_name}
                              className="item-image"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/200';
                              }}
                            />
                          </div>

                          {/* Información del artista */}
                          <div className="item-info">
                            <h3 className="item-name">{fav.artist.full_name}</h3>
                            <p className="item-specialty">
                              {fav.artist.specialty || 'Artista'}
                            </p>

                            <div className="item-actions">
                              <button
                                className="btn-view-item"
                                onClick={() => viewArtistProfile(fav.artist.id)}
                              >
                                Ver perfil
                              </button>
                            </div>
                          </div>

                          {/* Botón de favorito */}
                          <button
                            className="btn-favorite"
                            onClick={() => removeFavoriteArtist(fav.artist.id)}
                            aria-label="Quitar de favoritos"
                          >
                            <svg
                              className="heart-icon"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Paginación artistas */}
                    {artistsPages > 1 && (
                      <div className="pagination">
                        {renderPageNumbers(currentPageArtists, artistsPages, setCurrentPageArtists)}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
