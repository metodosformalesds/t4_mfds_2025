/* 
  Autor: Erick Rangel
  servicio: productService.js
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
  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene lista de productos con búsqueda y filtros
  
  Parámetros: params - Objeto con skip, limit, category, search
  
  Retorna: Array de productos
  */
  async getProducts(params = {}) {
    const defaultParams = {
      skip: 0,
      limit: 20,
      ...params
    };

    const cleanParams = Object.fromEntries(
      Object.entries(defaultParams).filter(([_, value]) => value !== undefined && value !== '')
    );

    return await apiClient.get('/api/products/', cleanParams);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene un producto específico por su ID
  
  Parámetros: productId - ID del producto
  
  Retorna: Objeto con datos del producto
  */
  async getProductById(productId) {
    return await apiClient.get(`/api/products/${productId}`);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene los productos del usuario actualmente autenticado
  
  Parámetros: params - Parámetros de paginación
  
  Retorna: Array de productos del usuario
  */
  async getMyProducts(params = {}) {
    return await apiClient.get('/api/products/my-products', params);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Crea un nuevo producto con imágenes (multipart/form-data)
  
  Parámetros: data - Objeto con nombre, descripcion, precio, categoria, stock, address, imagenes
  
  Retorna: Producto creado
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

  /*
  Autor: Erick Rangel
  
  Descripción: Actualiza un producto existente con soporte para nuevas imágenes
  
  Parámetros: productId - ID del producto, data - Datos a actualizar, existingImages - URLs de imágenes existentes
  
  Retorna: Producto actualizado
  */
  async updateProduct(productId, data, existingImages = []) {
    if (data.imagenes && data.imagenes.length > 0) {
      const form = new FormData();
      form.append('name', data.nombre);
      form.append('description', data.descripcion || '');
      form.append('price', String(data.precio));
      form.append('category', data.categoria || 'producto');
      form.append('stock', String(data.stock));
      form.append('address', data.address || '');
      
      data.imagenes.forEach(file => {
        form.append('images', file);
      });
      
      return await apiClient.request(`/api/products/${productId}`, { 
        method: 'PUT', 
        body: form 
      });
    } else {
      const updateData = {
        name: data.nombre,
        description: data.descripcion || '',
        price: parseFloat(data.precio),
        category: data.categoria,
        stock: parseInt(data.stock),
        address: data.address,
        images: existingImages,
      };
      
      return await apiClient.request(`/api/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    }
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Incrementa el contador de vistas de un producto
  
  Parámetros: productId - ID del producto
  
  Retorna: void
  */
  async incrementViewCount(productId) {
  }
}

export const productService = new ProductService();
export default productService;