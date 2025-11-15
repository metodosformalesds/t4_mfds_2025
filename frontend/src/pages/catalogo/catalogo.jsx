/* 
  Autor: Erick Rangel  
  pagina: Catalogo.jsx
  fecha: 13-11-2025
  descripcion:
  - Mostrar lista de productos/materiales con filtros, ordenamiento y paginación
  - Filtrar por stock disponible
  - Ordenar por nombre, reseñas, calificación o precio
  - Navegar entre páginas de productos
  - Ver detalles de un producto y agregarlo al carrito 
  - muestra mensajes de carga, error o ausencia de productos
  - utiliza hook useProducts para obtener datos desde el backend
  - utiliza componentes Header, Footer y CardProducto para la presentación visual

  se exporta a app.jsx usando index.js
*/


import React, { useState, useCallback, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CardProducto } from '../../components/Cards/card_producto';
import { useProducts } from '../../hooks/useProducts';
import './Catalogo.css';

export const Catalogo = () => {
  const [ordenActivo, setOrdenActivo] = useState('nombre');
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('producto');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;

  // Hook para productos con paginación simple
  const { 
    products: productosBackend, 
    loading, 
    error, 
    refetch 
  } = useProducts({
    category: seccionActiva,
    skip: (paginaActual - 1) * productosPorPagina,
    limit: productosPorPagina,
    autoFetch: true
  });

  // Opciones de ordenamiento
  const opcionesOrden = [
    { id: 'nombre', nombre: 'Orden alfabético' },
    { id: 'reseñas', nombre: 'Más reseñas' },
    { id: 'calificacion', nombre: 'Mejor calificación' },
    { id: 'precio', nombre: 'Precio' }
  ];

  // Transformar datos del backend
  const productosTransformados = productosBackend.map(producto => ({
    id: producto.id,
    nombre: producto.name,
    artista: producto.user?.full_name || producto.user?.username || 'Artista',
    precio: `$${parseFloat(producto.price).toFixed(2)} mxn`,
    imagen: producto.images && producto.images.length > 0 ? producto.images[0] : './IMG.png',
    categoria: producto.category,
    enStock: producto.stock > 0 && producto.is_available,
    reseñas: producto.review_count || 0,
    calificacion: producto.average_rating || 0,
    stock: producto.stock,
    isMaterial: producto.category === 'material'
  }));

  // Aplicar filtro de stock
  let datosFiltrados = soloEnStock 
    ? productosTransformados.filter(item => item.enStock)
    : productosTransformados;

  // Aplicar ordenamiento en frontend
  const datosOrdenados = [...datosFiltrados].sort((a, b) => {
    switch (ordenActivo) {
      case 'nombre':
        return a.nombre.localeCompare(b.nombre);
      case 'reseñas':
        return b.reseñas - a.reseñas;
      case 'calificacion':
        return b.calificacion - a.calificacion;
      case 'precio':
        const precioA = parseFloat(a.precio.replace(/[^\d.]/g, ''));
        const precioB = parseFloat(b.precio.replace(/[^\d.]/g, ''));
        return precioA - precioB;
      default:
        return 0;
    }
  });

  // Handler para cambiar página
  const cambiarPagina = (pagina) => {
    setPaginaActual(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler para cambiar sección
  const cambiarSeccion = useCallback((seccion) => {
    setSeccionActiva(seccion);
    setPaginaActual(1);
  }, []);

  // Handlers para acciones
  const agregarAlCarrito = useCallback((producto) => {
    console.log('Agregando al carrito:', producto.nombre);
  }, []);

  const verDetalles = useCallback((producto) => {
    console.log('Viendo detalles:', producto.nombre);
    window.location.href = `/producto/${producto.id}`;
  }, []);

  // Calcular total de páginas (estimado basado en productos cargados)
  const totalPaginas = Math.max(1, Math.ceil(datosOrdenados.length / productosPorPagina));

  if (error) {
    return (
      <div className="pagina-catalogo">
        <Header />
        <div className="estado-catalogo error">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pagina-catalogo">
      <Header />

      <main className="contenido-catalogo">
        {/* SECCIÓN DE CONTROLES */}
        <aside className="filtros-catalogo">
          {/* SELECTOR DE SECCIÓN */}
          <div className="selector-seccion">
            <button
              className={`seccion-btn ${seccionActiva === 'producto' ? 'activa' : ''}`}
              onClick={() => cambiarSeccion('producto')}
            >
              Productos
            </button>
            <button
              className={`seccion-btn ${seccionActiva === 'material' ? 'activa' : ''}`}
              onClick={() => cambiarSeccion('material')}
            >
              Materiales
            </button>
          </div>
          
          {/* ORDENAMIENTO */}
          <div className="ordenamiento">
            <h3 className="titulo-ordenamiento">Ordenar por</h3>
            <div className="lista-ordenamiento">
              {opcionesOrden.map((opcion) => (
                <button
                  key={opcion.id}
                  className={`orden-item ${ordenActivo === opcion.id ? 'activo' : ''}`}
                  onClick={() => setOrdenActivo(opcion.id)}
                >
                  {opcion.nombre}
                </button>
              ))}
            </div>
          </div>
          
          {/* FILTRO STOCK */}
          <div className="filtro-stock">
            <label className="filtro-checkbox">
              <input 
                type="checkbox" 
                checked={soloEnStock}
                onChange={(e) => setSoloEnStock(e.target.checked)}
              />
              <span className="checkmark"></span>
              Solo {seccionActiva === 'producto' ? 'productos' : 'materiales'} en stock
            </label>
          </div>
        </aside>

        {/* SECCIÓN DE CONTENIDO */}
        <section className="productos-catalogo">
          {/* ENCABEZADO */}
          <div className="encabezado-productos">
            <div className="titulo-contador">
              <h1 className="titulo-productos">
                {seccionActiva === 'producto' ? 'Productos' : 'Materiales'}
              </h1>
              <div className="contador-productos">
                {datosOrdenados.length} {seccionActiva === 'producto' ? 'producto' : 'material'}
                {datosOrdenados.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div className="indicador-orden">
              Ordenado por: <strong>{opcionesOrden.find(o => o.id === ordenActivo)?.nombre}</strong>
            </div>
          </div>

          {/* GRILLA DE PRODUCTOS */}
          <div className="grid-productos-catalogo">
            {datosOrdenados.map((producto) => (
              <CardProducto
                key={producto.id}
                productName={producto.nombre}
                artistName={producto.artista}
                price={producto.precio}
                imageUrl={producto.imagen}
                onViewDetails={() => verDetalles(producto)}
                onAddToCart={() => agregarAlCarrito(producto)}
                buttonText="Ver detalles"
                className={!producto.enStock ? 'agotado' : ''}
                reseñas={producto.reseñas}
                calificacion={producto.calificacion}
                isMaterial={producto.isMaterial}
              />
            ))}
          </div>

          {/* PAGINACIÓN SIMPLE */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button 
                className="pagina-btn"
                disabled={paginaActual === 1}
                onClick={() => cambiarPagina(paginaActual - 1)}
              >
                Anterior
              </button>
              
              {[...Array(totalPaginas)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagina-numero ${paginaActual === index + 1 ? 'activa' : ''}`}
                  onClick={() => cambiarPagina(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                className="pagina-btn"
                disabled={paginaActual === totalPaginas}
                onClick={() => cambiarPagina(paginaActual + 1)}
              >
                Siguiente
              </button>
            </div>
          )}

          {/* MENSAJE SIN RESULTADOS */}
          {datosOrdenados.length === 0 && !loading && (
            <div className="sin-productos">
              <h3>
                {`No hay ${seccionActiva === 'producto' ? 'productos' : 'materiales'} disponibles`}
              </h3>
              <p>Vuelve más tarde para ver nuevos productos</p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="cargando">
              <div className="spinner"></div>
              <p>Cargando {seccionActiva === 'producto' ? 'productos' : 'materiales'}...</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;