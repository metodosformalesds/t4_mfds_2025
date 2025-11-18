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

/*
Autor: Erick Rangel

Descripción: Hook personalizado para manejar productos con paginación y filtros

Parámetros: options - Objeto con category, skip, limit, autoFetch

Retorna: Objeto con products, loading, error, refetch, fetchProducts, isEmpty, hasError
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

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene productos desde el backend con filtros y paginación
  
  Parámetros: fetchOptions - Opciones adicionales para la consulta
  
  Retorna: void
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
      
      const data = await productService.getProducts(params);
      setProducts(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, category]);

  /*
  Autor: Erick Rangel
  
  Descripción: Recarga productos con nuevas opciones
  
  Parámetros: newOptions - Nuevas opciones para la consulta
  
  Retorna: Promise con resultado de fetchProducts
  */
  const refetch = useCallback((newOptions = {}) => {
    return fetchProducts(newOptions);
  }, [fetchProducts]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products,
    loading,
    error,
    refetch,
    fetchProducts,
    isEmpty: products.length === 0 && !loading,
    hasError: !!error,
  };
};

export default useProducts;