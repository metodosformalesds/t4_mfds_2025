/*
  Autor: Erick Rangel
  Fecha: 16-11-2025
  Vista: Artistas.jsx
  Descripción: Muestra cards de artistas con filtrado alfabético
*/

import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { CardArtista } from '../../components/Cards/card_artista';
import artistService from '../../services/artistService';
import './Artistas.css';

export default function Artistas() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState('az');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.getArtists();
      setArtists(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar artistas');
    } finally {
      setLoading(false);
    }
  };

  // Ordenar artistas
  const sortedArtists = [...artists].sort((a, b) => {
    if (order === 'az') {
      return a.full_name.localeCompare(b.full_name);
    } else {
      return b.full_name.localeCompare(a.full_name);
    }
  });

  // Paginación
  const totalPages = Math.max(1, Math.ceil(sortedArtists.length / ITEMS_PER_PAGE));
  const paginatedArtists = sortedArtists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="artistas-page">
      <Header />

      <main className="contenido-artistas">
        {/* SECCIÓN DE CONTROLES */}
        <aside className="filtros-artistas">
          {/* ORDENAMIENTO */}
          <div className="ordenamiento">
            <h3 className="titulo-ordenamiento">Ordenar por</h3>
            <div className="lista-ordenamiento">
              <button
                className={`orden-item ${order === 'az' ? 'activo' : ''}`}
                onClick={() => setOrder('az')}
              >
                A-Z
              </button>
              <button
                className={`orden-item ${order === 'za' ? 'activo' : ''}`}
                onClick={() => setOrder('za')}
              >
                Z-A
              </button>
            </div>
          </div>
        </aside>

        {/* SECCIÓN DE CONTENIDO */}
        <section className="artistas-section">
          {/* ENCABEZADO */}
          <div className="encabezado-artistas">
            <div className="titulo-contador">
              <h1 className="titulo-artistas">Artistas</h1>
              <div className="contador-artistas">
                {sortedArtists.length} artista{sortedArtists.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* GRILLA DE ARTISTAS */}
          <div className="grid-artistas">
            {paginatedArtists.map(artist => (
              <CardArtista
                key={artist.id}
                artistId={artist.id}
                artistName={artist.full_name}
                imageUrl={artist.profile_picture}
                buttonText="Ver perfil"
                isFavorite={false}
              />
            ))}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="paginacion">
              <button 
                className="pagina-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagina-numero ${currentPage === index + 1 ? 'activa' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                className="pagina-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="cargando">
              <div className="spinner"></div>
              <p>Cargando artistas...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="estado-error">
              <p>{error}</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
