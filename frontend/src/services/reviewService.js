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
  /*
  Autor: Erick Rangel
  
  Descripción: Crea una nueva reseña para un producto
  
  Parámetros: data - Objeto con product_id, order_id, title, comment, rating
  
  Retorna: Reseña creada
  */
  async createReview(data) {
    return await apiClient.post('/api/reviews/', data);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todas las reseñas de un producto específico
  
  Parámetros: productId - ID del producto
  
  Retorna: Array de reseñas del producto
  */
  async getProductReviews(productId) {
    return await apiClient.get(`/api/reviews/product/${productId}`);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene las reseñas del usuario autenticado
  
  Parámetros: role - Rol del usuario (default: 'reviewer')
  
  Retorna: Array de reseñas del usuario
  */
  async getMyReviews(role = 'reviewer') {
    return await apiClient.get('/api/reviews/my-reviews', { role });
  }
}

export const reviewService = new ReviewService();
export default reviewService;
