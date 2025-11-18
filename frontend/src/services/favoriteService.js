/*
  Autor: Erick Rangel
  Fecha: 15-11-2025
  Servicio: favoriteService.js
  Descripción: Gestión de productos y artistas favoritos del usuario
*/
import { apiClient } from './api';
import { authService } from './authService';

const favoriteService = {
  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todos los productos favoritos del usuario actual
  
  Parámetros: ninguno
  
  Retorna: Array de productos favoritos o array vacío si no autenticado
  */
  getFavoriteProducts: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }
    try {
      const response = await apiClient.get('/api/favorites/products');
      return response;
    } catch (error) {
      return [];
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Agrega un producto a favoritos
  
  Parámetros: productId - ID del producto a agregar
  
  Retorna: Response del servidor
  */
  addFavoriteProduct: async (productId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }
    try {
      const response = await apiClient.post('/api/favorites/products', {
        product_id: productId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina un producto de favoritos
  
  Parámetros: productId - ID del producto a eliminar
  
  Retorna: Response del servidor
  */
  removeFavoriteProduct: async (productId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }
    try {
      const response = await apiClient.delete(`/api/favorites/products/${productId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todos los artistas favoritos del usuario actual
  
  Parámetros: ninguno
  
  Retorna: Array de artistas favoritos o array vacío si no autenticado
  */
  getFavoriteArtists: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }
    try {
      const response = await apiClient.get('/api/favorites/artists');
      return response;
    } catch (error) {
      return [];
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Agrega un artista a favoritos
  
  Parámetros: artistId - ID del artista a agregar
  
  Retorna: Response del servidor
  */
  addFavoriteArtist: async (artistId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }
    try {
      const response = await apiClient.post('/api/favorites/artists', {
        artist_id: artistId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina un artista de favoritos
  
  Parámetros: artistId - ID del artista a eliminar
  
  Retorna: Response del servidor
  */
  removeFavoriteArtist: async (artistId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }
    try {
      const response = await apiClient.delete(`/api/favorites/artists/${artistId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default favoriteService;
