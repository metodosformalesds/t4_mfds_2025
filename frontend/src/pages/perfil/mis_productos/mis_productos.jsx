/* 
    Autor: Ian Domínguez - Erick Rangel
    Fecha: 15 de noviembre de 2025
    Descripción: Muestra una vista de los productos del usuario.
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../../components/Botones/btn_general';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import productService from '../../../services/productService';
import './mis_productos.css';

/*
  Autor: Erick Rangel

  Descripción: Componente que muestra la lista de productos del artista con opciones de filtrado, paginación y acciones (ver reseñas, modificar, eliminar).

  Parámetros: Ninguno

  Retorna: JSX.Element - Página con la lista de productos del artista
*/
export default function MisProductos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("precio");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, [currentPage, filtro]);

  /*
    Autor: Erick Rangel

    Descripción: Obtiene la lista de productos del artista desde el servidor y los prepara para mostrar con paginación.

    Parámetros: Ninguno

    Retorna: Promise<void>
  */
  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getMyProducts({ skip: 0, limit: 1000 });

      if (!response || response.length === 0) {
        setProductos([]);
        setTotalPages(1);
        return;
      }

      const productosMapeados = response.map(p => ({
        id: p.id,
        nombre: p.name,
        costo: parseFloat(p.price) || 0,
        imagen: (p.images && p.images.length > 0) ? p.images[0] : null,
        is_available: p.is_available,
        stock: p.stock,
      }));

      const itemsPerPage = 5;
      const totalPaginas = Math.ceil(productosMapeados.length / itemsPerPage) || 1;

      setProductos(productosMapeados);
      setTotalPages(totalPaginas);
      setCurrentPage(1);

    } catch (err) {
            setError('No se pudieron cargar los productos. Intenta de nuevo.');
      setProductos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de reseñas del producto especificado.

    Parámetros:
    - productoId (number): ID del producto

    Retorna: void
  */
  const handleVerResenas = (productoId) => {
    navigate(`/mi-cuenta/productos/${productoId}/resenas`);
  };

  /*
    Autor: Erick Rangel

    Descripción: Navega a la página de edición del producto especificado.

    Parámetros:
    - productoId (number): ID del producto

    Retorna: void
  */
  const handleModificar = (productoId) => {
    navigate(`/mi-cuenta/productos/${productoId}/editar`);
  };

  /*
    Autor: Erick Rangel

    Descripción: Maneja la eliminación de un producto (funcionalidad pendiente).

    Parámetros:
    - productoId (number): ID del producto

    Retorna: void
  */
  const handleEliminar = (productoId) => {
        alert('Funcionalidad de eliminación pendiente');
  };

  /*
    Autor: Erick Rangel

    Descripción: Cambia la página actual de productos y desplaza la vista al inicio.

    Parámetros:
    - page (number): Número de página a mostrar

    Retorna: void
  */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0,0);
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productosPaginados = productos.slice(startIndex, endIndex);

  return (
    <div className="mis-productos-page">
      <Header />

      <div className="mis-productos-container">
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </span>
          {" > "} Mis productos
        </div>

        <div className="productos-panel">
          <div className="panel-header">
            <div className="panel-header-top">
              <h1 className="panel-title">Mis productos</h1>
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
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : productos.length === 0 ? (
                <div className="empty-message">
                  <p>No tienes productos aún</p>
                </div>
              ) : (
                productosPaginados.map((producto) => (
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
                      {producto.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="producto-imagen"
                        />
                      ) : (
                        <div className="producto-imagen-placeholder">Sin imagen</div>
                      )}
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
