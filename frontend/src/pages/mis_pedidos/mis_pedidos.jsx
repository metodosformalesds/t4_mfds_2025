/* 
    Autor: Ian Domínguez
    Fecha: 15 de noviembre de 2025
    Descripción: Vista para mostrar pedidos del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../components/Botones/btn_general';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header'; 
import "./mis_pedidos.css";

export default function MisPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filtroMeses, setFiltroMeses] = useState("2");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, [currentPage, filtroMeses]);

  const fetchPedidos = async () => {
    setLoading(true);

    // Aquí harías tu fetch a la API
    // const response = await fetch(`/api/mis-pedidos?page=${currentPage}&meses=${filtroMeses}`);

    // Datos de ejemplo
    const mockPedidos = [
      {
        id: 1,
        fecha: "14 de febrero del 2025",
        total: 1229.97,
        producto: {
          nombre: "Chamarra de mezclilla bordada",
          artista: "Eduardo Muñós",
          imagen:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
        },
      },
      {
        id: 2,
        fecha: "14 de febrero del 2025",
        total: 1229.97,
        producto: {
          nombre: "Chamarra de mezclilla bordada",
          artista: "Eduardo Muñós",
          imagen:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
        },
      },
      {
        id: 3,
        fecha: "14 de febrero del 2025",
        total: 1229.97,
        producto: {
          nombre: "Chamarra de mezclilla bordada",
          artista: "Eduardo Muñós",
          imagen:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&h=150&fit=crop",
        },
      },
    ];

    setPedidos(mockPedidos);
    setLoading(false);
  };

  const handleModificarPedido = (pedidoId) => {
    console.log("Modificar pedido:", pedidoId);
    // Implementar lógica de modificación
  };

  const handleEliminarPedido = (pedidoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pedido?")) {
      console.log("Eliminar pedido:", pedidoId);
      // Implementar lógica de eliminación
    }
  };

  const handleEnviarMensaje = (pedidoId) => {
    console.log("Enviar mensaje al artista del pedido:", pedidoId);
    // Implementar lógica de mensaje
  };

  const handleEscribirResena = (pedidoId) => {
    navigate(`/mi-cuenta/pedidos/${pedidoId}/resena`);
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
    <div className="mis-pedidos-page">
      <Header />
      
      <div className="mis-pedidos-container">
        <div className="breadcrumb">Mi cuenta {">"} Mis pedidos</div>

        <div className="pedidos-panel">
          <div className="panel-header">
            <div className="panel-header-top">
              <h1 className="panel-title">Mis pedidos</h1>
              <form className="busqueda-form" onSubmit={handleBuscar}>
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
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
              <span className="filtro-label">Pedidos en los últimos</span>
              <select
                className="filtro-select"
                value={filtroMeses}
                onChange={(e) => setFiltroMeses(e.target.value)}
              >
                <option value="1">1 mes</option>
                <option value="2">2 meses</option>
                <option value="3">3 meses</option>
                <option value="6">6 meses</option>
                <option value="12">12 meses</option>
              </select>
            </div>
          </div>

          <div className="pedidos-lista">
            {loading ? (
              <div className="loading">Cargando pedidos...</div>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} className="pedido-item">
                  <div className="pedido-header">
                    <div className="pedido-info-header">
                      <h3 className="pedido-fecha">
                        Pedido del {pedido.fecha}
                      </h3>
                      <p className="pedido-total">
                        Total: ${pedido.total.toFixed(2)}
                      </p>
                    </div>
                    <div className="pedido-acciones-header">
                      <button
                        className="accion-link"
                        onClick={() => handleModificarPedido(pedido.id)}
                      >
                        Modificar pedido
                      </button>
                      <button
                        className="accion-link accion-eliminar"
                        onClick={() => handleEliminarPedido(pedido.id)}
                      >
                        Eliminar pedido
                      </button>
                    </div>
                  </div>
                  <div className="pedido-content">
                    <img
                      src={pedido.producto.imagen}
                      alt={pedido.producto.nombre}
                      className="pedido-imagen"
                    />
                    <div className="pedido-producto-info">
                      <h4 className="pedido-producto-nombre">
                        {pedido.producto.nombre}
                      </h4>
                      <p className="pedido-artista">
                        Artista: {pedido.producto.artista}
                      </p>
                    </div>
                    <div className="pedido-botones">
                      <BtnGeneral
                        property1="default"
                        color="amarillo"
                        text="Enviar mensaje al artista"
                        onClick={() => handleEnviarMensaje(pedido.id)}
                        className="btn-pedido"
                      />
                      <BtnGeneral
                        property1="default"
                        color="morado"
                        text="Escribir reseña"
                        onClick={() => handleEscribirResena(pedido.id)}
                        className="btn-pedido"
                      />
                    </div>
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
