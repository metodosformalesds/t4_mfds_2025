/* 
  Autor: Erick Rangel
  servicio: reviewService.js
  fecha: 17-11-2025

  Maneja operaciones de reseñas:
  - Crear reseña
  - Obtener reseñas de producto
  - Obtener reseñas del usuario
*/

import { apiClient } from './api';

class ReviewService {
  /**
   * Crear una reseña
   * @param {{product_id:number, order_id:number, title:string, comment:string, rating:number}} data
   */
  async createReview(data) {
    return await apiClient.post('/api/reviews/', data);
  }

  /**
   * Obtener reseñas de un producto
   */
  async getProductReviews(productId) {
    return await apiClient.get(`/api/reviews/product/${productId}`);
  }

  /**
   * Obtener reseñas del usuario autenticado
   */
  async getMyReviews(role = 'reviewer') {
    return await apiClient.get('/api/reviews/my-reviews', { role });
  }
}

export const reviewService = new ReviewService();
export default reviewService;
