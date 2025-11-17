/* 
  Autor: Erick Rangel - Ian Domínguez
  Fecha: 11 de noviembre de 205
  Descripción: muestra un hero y artículos y artistas relevantes (con mayor reseñas)

  se exporta a app.jsx usando index.js
*/


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnGeneral } from '../../components/Botones/btn_general';
import { CardProducto } from '../../components/Cards/card_producto'; 
import { CardArtista } from '../../components/Cards/card_artista';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import favoriteService from '../../services/favoriteService';
import { productService } from '../../services/productService';
import artistService from '../../services/artistService';
import './inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [favoritoArtistas, setFavoritoArtistas] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  const [artistasRecientes, setArtistasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar favoritos al montar
  useEffect(() => {
    cargarFavoritos();
    cargarHomeData();
  }, []);

  const cargarFavoritos = async () => {
    try {
      const favoriteProducts = await favoriteService.getFavoriteProducts();
      setFavoritos(favoriteProducts.map(fav => fav.product.id));
      
      const favoriteArtists = await favoriteService.getFavoriteArtists();
      setFavoritoArtistas(favoriteArtists.map(fav => fav.artist.id));
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  const cargarHomeData = async () => {
    try {
      setLoading(true);
      // Obtener productos disponibles y artistas
      const [productos, artistas] = await Promise.all([
        productService.getProducts({ skip: 0, limit: 100 }),
        artistService.getArtists(),
      ]);

      // Top 3 productos por número de reseñas (desc)
      const top3 = (productos || [])
        .slice() // copiar
        .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
        .slice(0, 3);
      setProductosPopulares(top3);

      // 4 artistas más recientes por created_at desc
      const recientes = (artistas || [])
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4);
      setArtistasRecientes(recientes);
    } catch (e) {
      console.error('Error cargando datos de inicio:', e);
      setError(e.message || 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductoFavoriteChange = (productId, isFavorite) => {
    if (isFavorite) {
      setFavoritos([...favoritos, productId]);
    } else {
      setFavoritos(favoritos.filter(id => id !== productId));
    }
  };

  const handleArtistFavoriteChange = (artistId, isFavorite) => {
    if (isFavorite) {
      setFavoritoArtistas([...favoritoArtistas, artistId]);
    } else {
      setFavoritoArtistas(favoritoArtistas.filter(id => id !== artistId));
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '$0.00 mxn';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price).replace('MXN', 'mxn');
    } catch {
      return `$${price.toFixed(2)} mxn`;
    }
  };

  return (
    <div className="pagina-inicio">
      <Header />

      {/* HERO SECTION */}
      <section className="hero-inicio">
          <div className="circulo-animado circulo-1"></div>
          <div className="circulo-animado circulo-2"></div>
          <div className="circulo-animado circulo-3"></div>
          <div className="circulo-animado circulo-4"></div>
          <div className="circulo-animado circulo-5"></div>
          <div className="circulo-animado circulo-6"></div>
        <div className="contenido-hero">
          <h1 className="titulo-hero">
            Descubre la auténtica artesanía de Ciudad Juárez
          </h1>
          <p className="descripcion-hero">
            Conectamos a talentosos artesanos con amantes del arte tradicional. 
            Explora piezas únicas y apoya el talento local.
          </p>
          <BtnGeneral
            className="btn-explorar"
            property1="default"
            text="Explorar productos"
            color="amarillo"
            onClick={() => navigate('/catalogo')} 
          />
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="seccion-productos">
        <div className="contenedor-titulo">
          <h2 className="titulo-seccion">Productos populares</h2>
        </div>
        {error && (
          <p className="mensaje-error" role="alert">{error}</p>
        )}
        <div className="grid-productos">
          {productosPopulares.map((p) => (
            <CardProducto
              key={p.id}
              productId={p.id}
              productName={p.name}
              artistName={p.user?.full_name || p.user?.username || 'Artista'}
              price={formatPrice(p.price)}
              imageUrl={(Array.isArray(p.images) && p.images[0]) || './IMG.png'}
              reseñas={p.review_count || 0}
              calificacion={p.average_rating || 0}
              isMaterial={p.category === 'material'}
              buttonText="Ver detalles"
              isFavorite={favoritos.includes(p.id)}
              onFavoriteChange={(isFavorite) => handleProductoFavoriteChange(p.id, isFavorite)}
            />
          ))}
        </div>
      </section>
      
      {/* SOBRE NOSOTROS - Ian Domínguez, 15 de noviembre de 2025 */}
      <section className="seccion-nosotros">
        <div className="contenedor-titulo">
          <h2 className="titulo-seccion">Sobre nosotros</h2>
        </div>
        <div className="contenido-nosotros">
          <div className="nosotros-logo">
            <img 
              src="../src/assets/logo-reborn.png" 
              alt="Reborn - Artesanía y Segunda Mano" 
              className="logo-nosotros"
            />
          </div>
          <div className="nosotros-textos">
            <p className="parrafo-nosotros">
              Reborn es una plataforma dedicada a promover y comercializar la artesanía mexicana, 
              conectando a artesanos talentosos con amantes del arte tradicional.
            </p>
            <p className="parrafo-nosotros">
              Nacimos con la misión de preservar las técnicas ancestrales y dar visibilidad al trabajo 
              de los artesanos de Ciudad Juárez, creando un puente entre la tradición y el mundo digital.
            </p>
            <p className="parrafo-nosotros">
              Cada pieza que encuentras aquí cuenta una historia, representa horas de dedicación y 
              lleva consigo el alma de quien la creó. Al comprar en Reborn, no solo adquieres un producto 
              único, sino que apoyas directamente a las comunidades artesanales locales.
            </p>
          </div>
        </div>
      </section>

      {/* ARTISTAS DESTACADOS */}
      <section className="seccion-artistas">
        <div className="contenedor-titulo">
          <h2 className="titulo-seccion">Artistas destacados</h2>
        </div>
        <div className="grid-artistas">
          {artistasRecientes.map((a) => (
            <CardArtista
              key={a.id}
              artistId={a.id}
              artistName={a.full_name || a.username}
              imageUrl={a.profile_picture}
              buttonText="Ver perfil"
              isFavorite={favoritoArtistas.includes(a.id)}
              onFavoriteChange={(isFavorite) => handleArtistFavoriteChange(a.id, isFavorite)}
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};