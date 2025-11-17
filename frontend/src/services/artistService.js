/*
  Autor: Erick Rangel
  Fecha: 16-11-2025
  Servicio: artistService.js
  Descripción: manda requests al back para el modelo de users
*/
import apiClient from './api';

const artistService = {
  async getArtists() {
    return await apiClient.get('/api/users/artists');
  },

  async getArtistById(artistId) {
    return await apiClient.get(`/api/users/${artistId}`);
  },

  async getArtistProducts(artistId) {
    return await apiClient.get('/api/products/', {
      user_id: artistId,
      limit: 100
    });
  },
};

export default artistService;
