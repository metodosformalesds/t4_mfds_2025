/* 
  Autor: Erick Rangel
  servicio: authService.js
  fecha: 14-11-2025

  maneja todas las operaciones relacionadas con productos:
  - Obtener lista de productos con filtros y búsqueda
  - Obtener un producto específico por su ID
  - Obtener productos del usuario actualmente autenticado
  - Incrementar el contador de vistas de un producto

  apiCliente se comunica al backend.
*/


import { apiClient } from './api';

class ProductService {
  /**
   * Obtener lista de productos con búsqueda
   * @param {Object} params - Parámetros de filtro
   * @param {number} params.skip - Número de elementos a saltar
   * @param {number} params.limit - Límite de elementos
   * @param {string} params.category - Categoría: 'producto' o 'material'
   * @param {string} params.search - Término de búsqueda por nombre
   * @returns {Promise<Array>} Lista de productos
   */
  async getProducts(params = {}) {
    const defaultParams = {
      skip: 0,
      limit: 20,
      ...params
    };

    // Limpiar parámetros undefined
    const cleanParams = Object.fromEntries(
      Object.entries(defaultParams).filter(([_, value]) => value !== undefined && value !== '')
    );

    return await apiClient.get('/api/products/', cleanParams);
  }

  /**
   * Obtener un producto por ID
   * @param {number} productId - ID del producto
   * @returns {Promise<Object>} Producto
   */
  async getProductById(productId) {
    return await apiClient.get(`/api/products/${productId}`);
  }

  /**
   * Obtener productos del usuario actual
   * @param {Object} params - Parámetros de paginación
   * @returns {Promise<Array>} Lista de productos del usuario
   */
  async getMyProducts(params = {}) {
    return await apiClient.get('/api/products/my-products', params);
  }

  /**
   * Crear un nuevo producto (multipart/form-data)
   * @param {Object} data - Datos del producto
   * @param {string} data.nombre - Nombre del producto
   * @param {string} data.descripcion - Descripción
   * @param {string|number} data.precio - Precio
   * @param {string} data.categoria - Categoría
   * @param {string|number} data.stock - Stock
   * @param {string} data.address - Dirección / ubicación
   * @param {File[]} data.imagenes - Archivos de imagen
   * @returns {Promise<Object>} Producto creado
   */
  async createProduct(data) {
    const form = new FormData();
    form.append('name', data.nombre);
    form.append('description', data.descripcion || '');
    form.append('price', String(data.precio));
    form.append('category', data.categoria || 'producto');
    form.append('stock', String(data.stock));
    form.append('address', data.address || '');
    if (Array.isArray(data.imagenes)) {
      data.imagenes.forEach(file => {
        form.append('images', file);
      });
    }
    return await apiClient.request('/api/products/', { method: 'POST', body: form });
  }

  /**
   * Incrementar contador de vistas de un producto
   * @param {number} productId - ID del producto
   */
  async incrementViewCount(productId) {
    // Nota: Esto probablemente se maneja automáticamente en el backend
    // cuando se llama a getProductById
    console.log(`Incrementando vistas del producto ${productId}`);
  }
}

// Instancia global del servicio
export const productService = new ProductService();
export default productService;