/*
 * Autor: Erick Rangel
 * Fecha: 15-11-2025
 * Componente: confirmation.jsx
 * Descripción: Página de confirmación de orden que muestra detalles de la compra, estado del pago,
 *              dirección de envío, productos comprados e información de contacto después del checkout.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/footer';
import { BtnGeneral } from '../../components/Botones/btn_general';
import { orderService } from '../../services/orderService';
import './confirmation.css';

/**
 * Página de confirmación de orden después del pago exitoso
 * Muestra los detalles de la orden completada
 */
export const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const orderId = searchParams.get('order_id');
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  // Cargar datos de la orden al montar el componente
  useEffect(() => {
  const loadOrderData = async () => {
    const orderId = searchParams.get('order_id');
    const sessionId = searchParams.get('session_id');

    if (!orderId) {
      setError('No se encontró información de la orden');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Cargando orden:', orderId);
      console.log('Session ID:', sessionId);
      
      // Obtener datos de la orden desde el backend
      const orderData = await orderService.getOrder(parseInt(orderId));
      
      // Si la orden ya está pagada
      if (!orderData.paid_at) {
        console.log('⏳ Orden aún no marcada como pagada - el webhook puede estar en proceso');
        // Podemos mostrar la orden igual, pero con estado "procesando pago"
      }
      
      setOrder(orderData);
      console.log('Orden cargada:', orderData);
      
    } catch (err) {
      console.error('Error cargando orden:', err);
      setError(err.message || 'Error al cargar los detalles de la orden');
    } finally {
      setLoading(false);
    }
  };

  loadOrderData();
}, [orderId]); // Mantener orderId como dependencia

// Polling para verificar si el pago se confirmó
useEffect(() => {
  if (!order || order.paid_at) return; // Solo si la orden no está pagada

  const pollInterval = setInterval(async () => {
    try {
      console.log('🔄 Verificando estado del pago...');
      const updatedOrder = await orderService.getOrder(order.id);
      
      if (updatedOrder.paid_at) {
        console.log('✅ ¡Pago confirmado!');
        setOrder(updatedOrder);
        clearInterval(pollInterval);
      }
    } catch (error) {
      console.error('Error verificando pago:', error);
    }
  }, 3000); // Verificar cada 3 segundos

  return () => clearInterval(pollInterval);
}, [order]); // Depende de la orden actual

  // Ver detalles de la orden
  const handleViewOrderDetails = () => {
    alert('Funcionalidad de detalles de orden en desarrollo');
  };

  const handleContinueShopping = () => {
    navigate('/catalogo');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="confirmation-page">
        <Header />
        <main className="confirmation-main">
          <div className="confirmation-container">
            <div className="loading-confirmation">
              <div className="loading-spinner"></div>
              <h2>Confirmando tu orden...</h2>
              <p>Estamos procesando los detalles de tu compra</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="confirmation-page">
        <Header />
        <main className="confirmation-main">
          <div className="confirmation-container">
            <div className="error-confirmation">
              <div className="error-icon"></div>
              <h2>Error al cargar la orden</h2>
              <p>{error}</p>
              <div className="error-actions">
                <BtnGeneral
                  text="Volver al Inicio"
                  color="morado"
                  onClick={handleGoHome}
                />
                <BtnGeneral
                  text="Reintentar"
                  color="amarillo"
                  onClick={() => window.location.reload()}
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Confirmación exitosa
  return (
    <div className="confirmation-page">
      <Header />
      
      <main className="confirmation-main">
        <div className="confirmation-container">
          
          {/* ENCABEZADO DE CONFIRMACIÓN */}
          <div className="confirmation-header">
            <div className="success-icon"></div>
            <h1 className="confirmation-title">¡Orden confirmada!</h1>
            <p className="confirmation-subtitle">
              Gracias por tu compra! Tu orden ha sido procesada exitosamente.
            </p>
          </div>

          {/* INFORMACIÓN DE LA ORDEN */}
          {order && (
            <div className="order-details">
              <div className="details-card">
                <h3 className="details-title">Detalles de la orden</h3>
                
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Número de orden</span>
                    <span className="detail-value">#{order.id}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Fecha</span>
                    <span className="detail-value">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Total</span>
                    <span className="detail-value total-amount">
                      ${order.total_amount?.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Estado del pago</span>
                    <span className={`detail-value status-badge ${order.paid_at ? 'status-paid' : 'status-processing'}`}>
                      {order.paid_at ? 'Pagada' : 'Procesando pago...'}
                    </span>
                  </div>
                </div>

                {/* MENSAJE DE PROCESAMIENTO SI NO ESTÁ PAGADA */}
                {!order.paid_at && (
                  <div className="processing-notice">
                    <p>Tu pago está siendo confirmado. Esto puede tomar unos segundos.</p>
                    <p>La página se actualizará automáticamente cuando se complete.</p>
                  </div>
                )}
              </div>

              {/* INFORMACIÓN DE ENVÍO */}
              <div className="shipping-card">
                <h3 className="details-title">Dirección de envío</h3>
                <p className="shipping-address">{order.address}</p>
                
                <div className="shipping-estimate">
                  <span className="estimate-icon"></span>
                  <span className="estimate-text">
                    Tiempo estimado de entrega: 3-5 días hábiles
                  </span>
                </div>
              </div>

              {/* INFORMACIÓN DE CONTACTO */}
              <div className="contact-card">
                <h3 className="details-title">Información de contacto</h3>
                <div className="contact-details">
                  <p><strong>Email:</strong> {order.buyer?.email}</p>
                  {order.buyer?.phone && (
                    <p><strong>Teléfono:</strong> {order.buyer.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RESUMEN DE PRODUCTOS */}
          {order && order.items && order.items.length > 0 && (
            <div className="products-summary">
              <h3 className="summary-title">Productos en tu orden</h3>
              
              <div className="products-list">
                {order.items.map((item) => (
                  <div key={item.id} className="product-card">
                    <div className="product-image">
                      <img 
                        src={item.product?.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.product?.name}
                      />
                    </div>
                    
                    <div className="product-info">
                      <h4 className="product-name">{item.product?.name}</h4>
                      <p className="product-seller">
                        por {item.product?.user?.full_name || 'Artista'}
                      </p>
                      <div className="product-meta">
                        <span className="product-quantity">Cantidad: {item.quantity}</span>
                        <span className="product-price">
                          ${item.unit_price?.toFixed(2)} c/u
                        </span>
                      </div>
                    </div>
                    
                    <div className="product-total">
                      ${((item.unit_price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCIONES */}
          <div className="confirmation-actions">
            <BtnGeneral
              text="Seguir comprando"
              color="morado"
              onClick={handleContinueShopping}
              className="action-btn"
            />
            
            <BtnGeneral
              text="Ir a mis ordenes"
              color="amarillo"
              onClick={handleViewOrderDetails}
              className="action-btn"
            />
            
            <BtnGeneral
              text="Ir al inicio"
              color="rosa"
              onClick={handleGoHome}
              className="action-btn"
            />
          </div>

          {/* INFORMACIÓN ADICIONAL */}
          <div className="additional-info">
            <div className="info-card">
              <h4>¿Qué sigue?</h4>
              <ul>
                <li>Recibirás un email de confirmación con los detalles</li>
                <li>Te notificaremos cuando tu pedido sea enviado</li>
                <li>Puedes contactarnos si tienes alguna pregunta</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h4>Soporte</h4>
              <p>
                ¿Necesitas ayuda? Contáctanos en{' '}
                <a href="mailto:info@reborn.com">info@reborn.com</a>
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;