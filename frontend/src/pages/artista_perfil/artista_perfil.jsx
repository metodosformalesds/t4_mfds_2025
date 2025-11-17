/*
  Autor: Ian Dominguez
  Fecha: 16 de noviembre de 2025
  Componente: Artista_perfil
  Descripción: Vista del perfil del artista para compradores
*/

import React, { useState } from "react";
import { CardProducto } from "../../components/Cards/card_producto";
import { BtnGeneral } from "../../components/Botones/btn_general";
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import "./artista_perfil.css";

export const ArtistProfile = () => {
  // Configuración - cambiar a false para ocultar información sensible
  const SHOW_EMAIL = true;
  const SHOW_PHONE = true;

  // Datos del artista basados en el modelo User
  const [artist] = useState({
    User_ID: 1,
    Name: "María García",
    Email: "maria.garcia@email.com",
    Phone: "+52 555 123 4567",
    Role: "Artista",
    Birth_Date: "1985-03-15",
    Image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    username: "@maria_artesana",
    bio: "Artesana mexicana con más de 15 años de experiencia en técnicas tradicionales de bordado y tejido. Mi trabajo está inspirado en los patrones ancestrales de Oaxaca, combinando la tradición con diseños contemporáneos. Cada pieza es única y cuenta una historia de nuestra cultura.",
    address: "Oaxaca de Juárez, Oaxaca, México",
  });

  // Productos del artista basados en el modelo Product
  const [products] = useState([
    {
      Product_ID: 1,
      User_ID: 1,
      Category_ID: 2,
      Name: "Rebozo Tradicional Oaxaqueño",
      Description: "Rebozo tejido a mano con técnica de telar de cintura",
      Price: "2,850.00",
      Material: "Algodón orgánico",
      Featured: true,
      Created_at: "2024-01-15",
      Stock: 3,
      Image_url:
        "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400",
      reseñas: 12,
      calificacion: 4.8,
    },
    {
      Product_ID: 2,
      User_ID: 1,
      Category_ID: 3,
      Name: "Bolsa Bordada Flores",
      Description: "Bolsa de mano con bordado tradicional de flores",
      Price: "1,200.00",
      Material: "Lona y hilos de algodón",
      Featured: false,
      Created_at: "2024-02-20",
      Stock: 8,
      Image_url:
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400",
      reseñas: 8,
      calificacion: 4.5,
    },
    {
      Product_ID: 3,
      User_ID: 1,
      Category_ID: 1,
      Name: "Mantel Bordado Artesanal",
      Description: "Mantel rectangular con bordado de punto de cruz",
      Price: "3,500.00",
      Material: "Manta de algodón",
      Featured: true,
      Created_at: "2024-03-10",
      Stock: 2,
      Image_url:
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400",
      reseñas: 15,
      calificacion: 4.9,
    },
    {
      Product_ID: 4,
      User_ID: 1,
      Category_ID: 4,
      Name: "Huipil Bordado Tradicional",
      Description: "Huipil con bordado de cadenilla y punto de satín",
      Price: "4,200.00",
      Material: "Algodón y seda",
      Featured: true,
      Created_at: "2024-04-05",
      Stock: 1,
      Image_url:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
      reseñas: 20,
      calificacion: 5.0,
    },
    {
      Product_ID: 5,
      User_ID: 1,
      Category_ID: 2,
      Name: "Cojines Decorativos (Par)",
      Description: "Par de cojines con bordado geométrico zapoteco",
      Price: "1,800.00",
      Material: "Lana y algodón",
      Featured: false,
      Created_at: "2024-05-12",
      Stock: 5,
      Image_url:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400",
      reseñas: 6,
      calificacion: 4.3,
    },
    {
      Product_ID: 6,
      User_ID: 1,
      Category_ID: 3,
      Name: "Cartera Tejida Multicolor",
      Description: "Cartera pequeña tejida con técnica de macramé",
      Price: "650.00",
      Material: "Hilo de algodón encerado",
      Featured: false,
      Created_at: "2024-06-01",
      Stock: 12,
      Image_url:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      reseñas: 10,
      calificacion: 4.6,
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProducts = products
    .filter((product) => {
      if (selectedFilter === "featured") return product.Featured;
      if (selectedFilter === "instock") return product.Stock > 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low")
        return (
          parseFloat(a.Price.replace(",", "")) -
          parseFloat(b.Price.replace(",", ""))
        );
      if (sortBy === "price-high")
        return (
          parseFloat(b.Price.replace(",", "")) -
          parseFloat(a.Price.replace(",", ""))
        );
      if (sortBy === "recent")
        return new Date(b.Created_at) - new Date(a.Created_at);
      return 0;
    });

  const handleAddToCart = (productId) => {
    console.log("Agregar al carrito:", productId);
  };

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
                  src={artist.Image}
                  alt={artist.Name}
                  className="artist-image"
                />
              </div>
            </div>

            {/* Información del Artista */}
            <div className="artist-info">
              <div className="artist-name-section">
                <h1 className="artist-full-name">{artist.Name}</h1>
                <span className="artist-username">{artist.username}</span>
              </div>

              <p className="artist-bio">{artist.bio}</p>

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
                    <span className="contact-text">{artist.address}</span>
                  </div>

                  {SHOW_EMAIL && (
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="contact-text">{artist.Email}</span>
                    </div>
                  )}

                  {SHOW_PHONE && (
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="contact-text">{artist.Phone}</span>
                    </div>
                  )}
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
              key={product.Product_ID}
              productId={product.Product_ID}
              productName={product.Name}
              artistName={artist.Name}
              price={`$${product.Price} mxn`}
              imageUrl={product.Image_url}
              onAddToCart={() => handleAddToCart(product.Product_ID)}
              buttonText="Ver detalles"
              reseñas={product.reseñas}
              calificacion={product.calificacion}
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

      {/* Botón Flotante de Contacto */}
      <div className="contact-button-container">
        <BtnGeneral
          property1="default"
          text="Contactar Artista"
          color="rosa"
          className="contact-button"
        />
      </div>
    </div>
     <Footer />
    </>
  );
};

