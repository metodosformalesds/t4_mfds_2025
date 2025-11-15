/* 
  Autor: Erick Rangel
  hook: useProducts.js
  fecha: 14-11-2025
  descripcion:
  - Fetch de productos con filtros por categoría, paginación (skip y limit)
  - soporta estados de carga y manejo de errores
  - recargar productos refetch o fetch manual fetchProducts
  - Soporta fetch automático al inicializar o cuando cambian las dependencias
    usa productService para comunicarse con el backend
*/

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/**
 * Hook personalizado para manejar productos con paginación simple
 */
export const useProducts = (options = {}) => {
  const {
    category = null,
    skip = 0,
    limit = 12,
    autoFetch = true
  } = options;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch productos desde el backend
   */
  const fetchProducts = useCallback(async (fetchOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip: fetchOptions.skip !== undefined ? fetchOptions.skip : skip,
        limit: fetchOptions.limit !== undefined ? fetchOptions.limit : limit,
        category: fetchOptions.category !== undefined ? fetchOptions.category : category,
      };

      console.log('Fetching products with params:', params);
      
      const data = await productService.getProducts(params);
      setProducts(data);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, category]);

  /**
   * Recargar productos
   */
  const refetch = useCallback((newOptions = {}) => {
    return fetchProducts(newOptions);
  }, [fetchProducts]);

  // Fetch automático cuando cambian las dependencias
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    // Estado
    products,
    loading,
    error,
    
    // Acciones
    refetch,
    fetchProducts,
    
    // Utilidades
    isEmpty: products.length === 0 && !loading,
    hasError: !!error,
  };
};

export default useProducts;