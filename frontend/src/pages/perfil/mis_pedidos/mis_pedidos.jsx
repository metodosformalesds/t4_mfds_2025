/* 
    Autor: Ian Domínguez - Erick Rangel
    Fecha: 15 de noviembre de 2025
    Descripción: Vista para mostrar pedidos del usuario
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BtnGeneral } from '../../../components/Botones/btn_general';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header'; 
import orderService from '../../../services/orderService';
import "./mis_pedidos.css";

export default function MisPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [filtroMeses, setFiltroMeses] = useState("2");
  const [busqueda, setBusqueda] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmLoadingId, setConfirmLoadingId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('all');

  useEffect(() => {
    fetchPedidos();
  }, [filtroMeses, filtroEstado]);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener órdenes del usuario desde el backend
      const response = await orderService.getMyOrders();
      
      if (!response || response.length === 0) {
        setPedidos([]);
        setTotalPages(1);
        return;
      }

      // Filtrar órdenes por fecha según los meses seleccionados
      const mesesNum = parseInt(filtroMeses);
      const ahora = new Date();
      const fechaLimite = new Date(ahora.getTime() - mesesNum * 30 * 24 * 60 * 60 * 1000);

      const pedidosFiltrados = response.filter(order => {
        const fechaPedido = new Date(order.created_at);
        return fechaPedido >= fechaLimite;
      }).map(order => ({
        id: order.id,
        fecha: new Date(order.created_at).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        total: order.total_amount || 0,
        estado: order.status,
        productos: order.items || [],
        direccion: order.address
      }));

      // Filtro por estado (pending/confirmed) si aplica
      const pedidosPorEstado =
        filtroEstado === 'all'
          ? pedidosFiltrados
          : pedidosFiltrados.filter(p => (p.estado || '').toLowerCase() === filtroEstado);

      // Calcular total de páginas (5 items por página)
      const itemsPerPage = 5;
      const totalPaginasCalculadas = Math.ceil(pedidosPorEstado.length / itemsPerPage);
      
      setPedidos(pedidosPorEstado);
      setTotalPages(totalPaginasCalculadas > 0 ? totalPaginasCalculadas : 1);
      setCurrentPage(1);

    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
      setPedidos([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleEscribirResena = (pedidoId) => {
    navigate(`/mi-cuenta/pedidos/${pedidoId}/resena`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleConfirmarPedido = async (orderId) => {
    try {
      setConfirmLoadingId(orderId);
      await orderService.confirmOrder(orderId);
      await fetchPedidos();
    } catch (e) {
      console.error('Error confirmando pedido:', e);
      // Opcional: mostrar notificación/toast aquí
    } finally {
      setConfirmLoadingId(null);
    }
  };

  // Obtener pedidos paginados
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pedidosPaginados = pedidos.slice(startIndex, endIndex);

  return (
    <div className="mis-pedidos-page">
      <Header />
      
      <div className="mis-pedidos-container">
        <div className="breadcrumb">
          <span 
            className="breadcrumb-link"
            onClick={() => navigate("/mi-cuenta")}
          >
            Mi cuenta
          </span>
          {" > "} Mis pedidos
        </div>

        <div className="pedidos-panel">
          <div className="panel-header">
            <div className="panel-header-top">
              <h1 className="panel-title">Mis pedidos</h1>
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
            <div className="filtro-container" style={{ marginTop: 10 }}>
              <span className="filtro-label">Estado</span>
              <select
                className="filtro-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmados</option>
              </select>
            </div>
          </div>

          <div className="pedidos-lista">
            {loading ? (
              <div className="loading">Cargando pedidos...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : pedidos.length === 0 ? (
              <div className="empty-message">
                <p>No hay pedidos en los últimos {filtroMeses} meses</p>
              </div>
            ) : (
              pedidosPaginados.map((pedido) => (
                <div key={pedido.id} className="pedido-item">
                  <div className="pedido-header">
                    <div className="pedido-info-header">
                      <h3 className="pedido-fecha">
                        Pedido del {pedido.fecha}
                      </h3>
                      <p className="pedido-total">
                        Total: ${pedido.total.toFixed(2)}
                      </p>
                      {pedido.estado && (
                        <p className="pedido-estado">
                          Estado: <span className={`estado-${pedido.estado.toLowerCase()}`}>{pedido.estado}</span>
                        </p>
                      )}
                    </div>
                    <div className="pedido-acciones-header">
                      {pedido.estado?.toLowerCase() !== 'confirmed' && (
                        <BtnGeneral
                          property1="variant-2"
                          color="amarillo"
                          text={confirmLoadingId === pedido.id ? 'Confirmando...' : 'Marcar como entregada'}
                          onClick={() => handleConfirmarPedido(pedido.id)}
                          className="btn-pedido"
                          disabled={confirmLoadingId === pedido.id}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Mostrar todos los productos del pedido */}
                  <div className="pedido-productos">
                    {pedido.productos && pedido.productos.length > 0 ? (
                      pedido.productos.map((ordenProducto, index) => (
                        <div key={index} className="pedido-content">
                          {ordenProducto.product?.images && ordenProducto.product.images.length > 0 && (
                            <img
                              src={ordenProducto.product.images[0]}
                              alt={ordenProducto.product?.name || 'Producto'}
                              className="pedido-imagen"
                            />
                          )}
                          <div className="pedido-producto-info">
                            <h4 className="pedido-producto-nombre">
                              {ordenProducto.product?.name || 'Producto sin nombre'}
                            </h4>
                            <p className="pedido-artista">
                              Artista: {ordenProducto.product?.user?.full_name || 'Artista desconocido'}
                            </p>
                            <p className="pedido-cantidad">
                              Cantidad: {ordenProducto.quantity}
                            </p>
                            <p className="pedido-precio">
                              Precio unitario: ${parseFloat(ordenProducto.unit_price).toFixed(2)}
                            </p>
                          </div>
                          <div className="pedido-botones">
                            <BtnGeneral
                              property1="default"
                              color="morado"
                              text="Escribir reseña"
                              onClick={() => handleEscribirResena(pedido.id)}
                              className="btn-pedido"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pedido-content">
                        <p className="sin-productos">No hay productos en este pedido</p>
                      </div>
                    )}
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
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
        )}
      </div>

      <Footer />
    </div>
  );
}
