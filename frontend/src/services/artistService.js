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
};

export default artistService;
