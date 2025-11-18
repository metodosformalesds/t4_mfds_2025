/*
  Autor: Ian Dominguez
  Fecha: 16 de noviembre de 2025
  Componente: Artista_perfil
  Descripción: Vista del perfil del artista para compradores
*/

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CardProducto } from "../../components/Cards/card_producto";
import { BtnGeneral } from "../../components/Botones/btn_general";
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import artistService from '../../services/artistService';
import './artista_perfil.css';

/*
  Autor: Erick Rangel

  Descripción: Componente que muestra el perfil público de un artista incluyendo su información, biografía y productos con opciones de filtrado y ordenamiento.

  Parámetros: Ninguno (usa useParams para obtener el artistId de la URL)

  Retorna: JSX.Element - Página de perfil del artista
*/
export const ArtistProfile = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  
  const SHOW_EMAIL = false;
  const SHOW_PHONE = false;

  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    /*
      Autor: Erick Rangel

      Descripción: Obtiene la información del artista y sus productos desde el servidor.

      Parámetros: Ninguno

      Retorna: Promise<void>
    */
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        setError(null);

        const artistResponse = await artistService.getArtistById(artistId);
        setArtist(artistResponse);

        const productsResponse = await artistService.getArtistProducts(artistId);
        setProducts(productsResponse);
      } catch (err) {
                setError('No se pudo cargar la información del artista');
      } finally {
        setLoading(false);
      }
    };

    if (artistId) {
      fetchArtistData();
    }
  }, [artistId]);

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de detalle del producto.

    Parámetros:
    - productId (number): ID del producto

    Retorna: void
  */
  const handleViewProduct = (productId) => {
    navigate(`/producto/${productId}`);
  };

  const filteredProducts = (products || [])
    .filter((product) => {
      if (selectedFilter === "featured") return product.is_featured;
      if (selectedFilter === "instock") return product.stock > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "recent")
        return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  if (loading) {
    return (
      <>
        <Header />
        <div className="artist-profile">
          <div className="loading-container">
            <p>Cargando perfil del artista...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !artist) {
    return (
      <>
        <Header />
        <div className="artist-profile">
          <div className="error-container">
            <p>{error || 'Artista no encontrado'}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
   <>
    <Header />
    <div className="artist-profile">
      {/* Header del Perfil del Artista */}
      <div className="artist-header">
        <div className="artist-header-content">
          <div className="artist-header-layout">
            {/* Imagen de Perfil */}
            <div className="artist-image-container">
              <div className="artist-image-wrapper">
                <img
                  src={artist.profile_picture || 'https://via.placeholder.com/220'}
                  alt={artist.full_name}
                  className="artist-image"
                />
              </div>
            </div>

            {/* Información del Artista */}
            <div className="artist-info">
              <div className="artist-name-section">
                <h1 className="artist-full-name">{artist.full_name}</h1>
                <span className="artist-username">@{artist.username}</span>
              </div>

              <p className="artist-bio">{artist.bio || 'Este artista no ha agregado una biografía.'}</p>

              {/* Información de Contacto */}
              <div className="artist-contact-card">
                <div className="contact-grid">
                  <div className="contact-item">
                    <svg
                      className="contact-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="contact-text">{artist.address || 'No especificada'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos */}
      <div className="products-section">
        <div className="products-header">
          <h2 className="products-title">Productos del Artista</h2>

          <div className="products-filters">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos los productos</option>
              <option value="featured">Destacados</option>
              <option value="instock">En stock</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recent">Más recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <CardProducto
              key={product.id}
              productId={product.id}
              productName={product.name}
              artistName={artist.full_name}
              price={`$${product.price.toFixed(2)} mxn`}
              imageUrl={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400'}
              onViewDetails={() => handleViewProduct(product.id)}
              buttonText="Ver detalles"
              reseñas={product.total_reviews || 0}
              calificacion={product.average_rating || 0}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <svg
              className="no-products-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="no-products-title">No hay productos disponibles</h3>
            <p className="no-products-text">
              Intenta cambiar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
     <Footer />
    </>
  );
};

