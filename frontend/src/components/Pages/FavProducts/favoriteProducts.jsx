/* 
  Autor: Ian Domínguez
  Fecha: 13 de noviembre de 2025
  Componente: Vista de lista de productos Favoritos
  Descripción: Vista que permite visualizar todos los productos favoritos que el usuario haya agregado

*/


import React, { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import './favoriteProductsStyles.css';

import Header from './components/Header/Header';  
import Footer from './components/Footer/Footer';  

export default function FavoriteProducts({ userId }) {
  //const navigate = useNavigate();
  
  // Estados
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const PRODUCTS_PER_PAGE = 10;

  // Cargar productos favoritos
  useEffect(() => {
    fetchFavoriteProducts(currentPage);
  }, [currentPage, userId]);

  const fetchFavoriteProducts = async (page) => {
    setLoading(true);
    
    // Aquí harías tu fetch a la API
    // const response = await fetch(`/api/users/${userId}/favorite-products?page=${page}&limit=${PRODUCTS_PER_PAGE}`);
    // const data = await response.json();
    
    // Datos de ejemplo basados en tu modelo de BD
    const mockProducts = [
      {
        product_id: 1,
        name: "Chamarra de mezclilla bordada",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        artist_id: 101,
        artist_name: "Eduardo Muñós"
      },
      {
        product_id: 2,
        name: "Chamarra de mezclilla bordada",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        artist_id: 101,
        artist_name: "Eduardo Muñós"
      },
      {
        product_id: 3,
        name: "Chamarra de mezclilla bordada",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
        artist_id: 101,
        artist_name: "Eduardo Muñós"
      }
    ];

    setFavoriteProducts(mockProducts);
    setTotalPages(4); // Simular 4 páginas
    setLoading(false);
  };

  // Quitar de favoritos
  const removeFavorite = async (productId) => {
    try {
      // Aquí harías tu DELETE a la API
      // await fetch(`/api/users/${userId}/favorite-products/${productId}`, {
      //   method: 'DELETE'
      // });

      console.log('Eliminando producto de favoritos:', productId);
      
      // Actualizar estado local inmediatamente
      setFavoriteProducts(prev => 
        prev.filter(product => product.product_id !== productId)
      );
      
      // Si la página queda vacía y no es la primera, ir a la anterior
      if (favoriteProducts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error al quitar de favoritos:', error);
    }
  };

  // Ver producto
  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Agregar al carrito
  const addToCart = (productId) => {
    console.log('Agregando al carrito:', productId);
    // Implementar lógica de agregar al carrito
  };

  // Navegación a artistas favoritos
  const goToFavoriteArtists = () => {
    navigate('/favorites/artists');
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
          className={`page-number ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="favorites-page">
      {/* Header Component */}
      <Header />

      <div className="favorites-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Mi cuenta</span>
          <span className="breadcrumb-separator">{'>'}</span>
          <span>Mis favoritos</span>
        </div>

        {/* Tabs de navegación */}
        <div className="favorites-tabs">
          <button className="tab-button tab-active">
            Productos
          </button>
          <button 
            className="tab-button"
            onClick={goToFavoriteArtists}
          >
            Artistas
          </button>
        </div>

        {/* Lista de productos */}
        <div className="products-list">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : favoriteProducts.length === 0 ? (
            <div className="no-favorites">
              <p>No tienes productos favoritos aún</p>
            </div>
          ) : (
            favoriteProducts.map((product) => (
              <div key={product.product_id} className="product-card">
                {/* Imagen del producto */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                {/* Información del producto */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-artist">Artista: {product.artist_name}</p>
                  <p className="product-price">${product.price.toFixed(2)} mxn</p>
                  
                  <div className="product-actions">
                    <button
                      className="btn-view-product"
                      onClick={() => viewProduct(product.product_id)}
                    >
                      Ver producto
                    </button>
                    <button
                      className="btn-add-cart"
                      onClick={() => addToCart(product.product_id)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>

                {/* Botón de favorito */}
                <button
                  className="btn-favorite"
                  onClick={() => removeFavorite(product.product_id)}
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
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            {renderPageNumbers()}
          </div>
        )}
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}