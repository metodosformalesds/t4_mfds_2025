/* 
  Autor: Erick Rangel
  hook: useProductDetail.js
  fecha: 14-11-2025
  descripcion:
  - Obtener datos completos del producto desde el backend usando su ID
  - Controlar estados de carga y error
  - Manejar la imagen seleccionada dentro de la galería del producto
  - Recargar datos cuando cambia el ID o cuando se solicita manualmente
  - Proveer utilidades como saber si el producto tiene imágenes, cuántas son
    y cuál es la imagen actualmente seleccionada
*/

import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

/*
Autor: Erick Rangel

Descripción: Hook personalizado para obtener y manejar detalles de un producto

Parámetros: productId - ID del producto a cargar

Retorna: Objeto con product, loading, error, selectedImage, handleImageSelect, refetch, hasImages, totalImages, currentImage
*/
export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene los datos del producto desde el backend por ID
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const fetchProductData = useCallback(async () => {
    if (!productId) {
      setError('ID de producto no válido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getProductById(productId);
      
      setProduct(productData);
      setSelectedImage(0);
      
    } catch (err) {
      setError(err.message || 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /*
  Autor: Erick Rangel
  
  Descripción: Maneja el cambio de imagen seleccionada en la galería
  
  Parámetros: index - Índice de la imagen a seleccionar
  
  Retorna: void
  */
  const handleImageSelect = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  /*
  Autor: Erick Rangel
  
  Descripción: Recarga los datos del producto desde el servidor
  
  Parámetros: ninguno
  
  Retorna: void
  */
  const refetch = useCallback(() => {
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return {
    product,
    loading,
    error,
    selectedImage,
    handleImageSelect,
    refetch,
    hasImages: product?.images && product.images.length > 0,
    totalImages: product?.images?.length || 0,
    currentImage: product?.images?.[selectedImage] || null,
  };
};

export default useProductDetail;