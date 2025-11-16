/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra una vista de los productos del usuario.
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./mis_productos.css";

export default function MisProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("precio");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductos();
  }, [currentPage, filtro]);

  const fetchProductos = async () => {
    setLoading(true);

    // Aquí harías tu fetch a la API
    // const response = await fetch(`/api/mis-productos?page=${currentPage}&sort=${filtro}`);

    // Datos de ejemplo
    const mockProductos = [
      {
        id: 1,
        nombre: "Chamarra de mezclilla bordada",
        costo: 799.99,
        imagen:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
      },
      {
        id: 2,
        nombre: "Chamarra de mezclilla bordada",
        costo: 799.99,
        imagen:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
      },
      {
        id: 3,
        nombre: "Chamarra de mezclilla bordada",
        costo: 799.99,
        imagen:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
      },
    ];

    setProductos(mockProductos);
    setLoading(false);
  };

  const handleModificar = (productoId) => {
    navigate(`/mi-cuenta/productos/editar/${productoId}`);
  };

  const handleEliminar = (productoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      console.log("Eliminar producto:", productoId);
      // Implementar lógica de eliminación
    }
  };

  const handleVerResenas = (productoId) => {
    navigate(`/mi-cuenta/productos/${productoId}/resenas`);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    console.log("Buscar:", busqueda);
    // Implementar búsqueda
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mis-productos-page">
      <Header />

      <div className="mis-productos-container">
        <div className="breadcrumb">Mi cuenta {">"} Mis productos</div>

        <div className="productos-panel">
          <div className="panel-header">
            <div className="panel-header-top">
              <h1 className="panel-title">Mis productos</h1>
              <form className="busqueda-form" onSubmit={handleBuscar}>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="busqueda-input"
                />
                <button type="submit" className="busqueda-btn">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </form>
            </div>
            <div className="filtro-container">
              <span className="filtro-label">Filtrar por</span>
              <select
                className="filtro-select"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              >
                <option value="precio">precio</option>
                <option value="nombre">nombre</option>
                <option value="fecha">fecha</option>
              </select>
            </div>
          </div>

          <div className="productos-lista">
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              productos.map((producto) => (
                <div key={producto.id} className="producto-item">
                  <div className="producto-header">
                    <div className="producto-info-header">
                      <h3 className="producto-nombre">{producto.nombre}</h3>
                      <p className="producto-costo">
                        Costo: ${producto.costo.toFixed(2)}
                      </p>
                    </div>
                    <div className="producto-acciones-header">
                      <button
                        className="accion-link"
                        onClick={() => handleModificar(producto.id)}
                      >
                        Modificar producto
                      </button>
                      <button
                        className="accion-link accion-eliminar"
                        onClick={() => handleEliminar(producto.id)}
                      >
                        Eliminar producto
                      </button>
                    </div>
                  </div>
                  <div className="producto-content">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="producto-imagen"
                    />
                    <div className="producto-nombre-repetido">
                      {producto.nombre}
                    </div>
                    <BtnGeneral
                      property1="default"
                      color="morado"
                      text="Ver reseñas"
                      onClick={() => handleVerResenas(producto.id)}
                      className="btn-ver-resenas"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Paginación */}
        <div className="paginacion">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`pagina-btn ${
                currentPage === index + 1 ? "pagina-activa" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
