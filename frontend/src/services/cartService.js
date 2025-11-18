/*
  Autor: Erick Rangel
  Fecha: 15-11-2025
  Servicio: cartService.js
  Descripción: Gestión del carrito de compras del usuario
*/
import { apiClient } from './api';

class CartService {
  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene todos los items del carrito del usuario
  
  Parámetros: ninguno
  
  Retorna: Array de items del carrito
  */
  async getCart() {
    return await apiClient.get('/api/cart/');
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Agrega un producto al carrito
  
  Parámetros: productId - ID del producto, quantity - Cantidad (default: 1)
  
  Retorna: Item del carrito creado
  */
  async addToCart(productId, quantity = 1) {
    return await apiClient.post('/api/cart/', {
      product_id: productId,
      quantity: quantity
    });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Actualiza la cantidad de un producto en el carrito
  
  Parámetros: productId - ID del producto, quantity - Nueva cantidad
  
  Retorna: Item del carrito actualizado
  */
  async updateCartItem(productId, quantity) {
    return await apiClient.put(`/api/cart/${productId}`, {
      quantity: quantity
    });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Elimina un producto del carrito
  
  Parámetros: productId - ID del producto
  
  Retorna: Response del servidor
  */
  async removeFromCart(productId) {
    return await apiClient.delete(`/api/cart/${productId}`);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Vacía el carrito completo del usuario
  
  Parámetros: ninguno
  
  Retorna: Response del servidor
  */
  async clearCart() {
    return await apiClient.delete('/api/cart/');
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Calcula la cantidad total de items en el carrito
  
  Parámetros: ninguno
  
  Retorna: Número total de items
  */
  async getTotalItems() {
    try {
      const cart = await this.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      return 0;
    }
  }
}

export const cartService = new CartService();
export default cartService;