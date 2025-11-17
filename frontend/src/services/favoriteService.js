import { apiClient } from './api';
import { authService } from './authService';

const favoriteService = {
  // ============ FAVORITE PRODUCTS ============
  
  /**
   * Get all favorite products for the current user
   */
  getFavoriteProducts: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }
    try {
      const response = await apiClient.get('/api/favorites/products');
      return response;
    } catch (error) {
      console.error('Error fetching favorite products:', error);
      return [];
    }
  },

  /**
   * Add a product to favorites
   * @param {number} productId - Product ID to favorite
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
      console.error('Error adding favorite product:', error);
      throw error;
    }
  },

  /**
   * Remove a product from favorites
   * @param {number} productId - Product ID to remove from favorites
   */
  removeFavoriteProduct: async (productId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }
    try {
      const response = await apiClient.delete(`/api/favorites/products/${productId}`);
      return response;
    } catch (error) {
      console.error('Error removing favorite product:', error);
      throw error;
    }
  },

  // ============ FAVORITE ARTISTS ============

  /**
   * Get all favorite artists for the current user
   */
  getFavoriteArtists: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }
    try {
      const response = await apiClient.get('/api/favorites/artists');
      return response;
    } catch (error) {
      console.error('Error fetching favorite artists:', error);
      return [];
    }
  },

  /**
   * Add an artist to favorites
   * @param {number} artistId - Artist ID to favorite
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
      console.error('Error adding favorite artist:', error);
      throw error;
    }
  },

  /**
   * Remove an artist from favorites
   * @param {number} artistId - Artist ID to remove from favorites
   */
  removeFavoriteArtist: async (artistId) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }
    try {
      const response = await apiClient.delete(`/api/favorites/artists/${artistId}`);
      return response;
    } catch (error) {
      console.error('Error removing favorite artist:', error);
      throw error;
    }
  },
};

export default favoriteService;
