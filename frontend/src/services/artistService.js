/*
  Autor: Erick Rangel
  Fecha: 16-11-2025
  Servicio: artistService.js
  Descripción: manda requests al back para el modelo de users
*/
import apiClient from './api';

const artistService = {
  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene la lista de todos los artistas
  
  Parámetros: ninguno
  
  Retorna: Array de artistas
  */
  async getArtists() {
    return await apiClient.get('/api/users/artists');
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene información de un artista específico por ID
  
  Parámetros: artistId - ID del artista
  
  Retorna: Objeto con datos del artista
  */
  async getArtistById(artistId) {
    return await apiClient.get(`/api/users/${artistId}`);
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todos los productos de un artista específico
  
  Parámetros: artistId - ID del artista
  
  Retorna: Array de productos del artista
  */
  async getArtistProducts(artistId) {
    return await apiClient.get('/api/products/', {
      user_id: artistId,
      limit: 100
    });
  },
};

export default artistService;
