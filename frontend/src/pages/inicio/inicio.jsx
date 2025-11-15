/* 
  Autor: Erick Rangel
  Fecha: 11 de noviembre de 205
  Descripción: muestra un hero y artículos y artistas relevantes (con mayor reseñas)

  se exporta a app.jsx usando index.js
*/


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BtnGeneral } from '../../components/Botones/btn_general';
import { BtnCarrito } from '../../components/Botones/btn_carrito';
import { CardProducto } from '../../components/Cards/card_producto'; 
import { CardArtista } from '../../components/Cards/card_artista';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import './inicio.css';

export const Inicio = () => {
  const navigate = useNavigate();

  // Datos de ejemplo para productos
  const productosDestacados = [
    {
      id: 1,
      nombre: "Chamarra de mezclilla bordada",
      artista: "Eduardo Muñoz",
      precio: "$799.99 mxn",
    },
    {
      id: 2,
      nombre: "Vestido tradicional",
      artista: "Alejandro Hernandez", 
      precio: "$650.00 mxn",
    },
    {
      id: 3,
      nombre: "Bolso artesanal",
      artista: "María González",
      precio: "$450.00 mxn",
    }
  ];

  // Datos de ejemplo para artistas
  const artistasDestacados = [
    {
      id: 1,
      nombre: "Eduardo Muñoz",
      especialidad: "Madera y bordados",
    },
    {
      id: 2, 
      nombre: "Alejandro Hernandez",
      especialidad: "Textiles y cerámica",
    },
    {
      id: 3,
      nombre: "María González",
      especialidad: "Arte tradicional",
    },
    {
      id: 4,
      nombre: "Carlos Rodríguez",
      especialidad: "Orfebrería",
    }
  ];

  return (
    <div className="pagina-inicio">
      <Header />

      {/* HERO SECTION */}
      <section className="hero-inicio">
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
        <div className="grid-productos">
          {productosDestacados.map((producto) => (
            <CardProducto
              key={producto.id}
              productName={producto.nombre}
              artistName={`${producto.artista}`}
              price={producto.precio}
              imageUrl={producto.imagen}
              onViewDetails={() => console.log(`Ver detalles: ${producto.nombre}`)}
              onAddToCart={() => console.log(`Agregar al carrito: ${producto.nombre}`)}
              buttonText="Ver detalles"
            />
          ))}
        </div>
      </section>

      {/* ARTISTAS DESTACADOS */}
      <section className="seccion-artistas">
        <div className="contenedor-titulo">
          <h2 className="titulo-seccion">Artistas Destacados</h2>
        </div>
        <div className="grid-artistas">
          {artistasDestacados.map((artista) => (
            <CardArtista
              key={artista.id}
              artistName={artista.nombre}
              specialty={artista.especialidad}
              imageUrl={artista.imagen}
              onViewProfile={() => console.log(`Ver perfil: ${artista.nombre}`)}
              buttonText="Ver perfil"
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};