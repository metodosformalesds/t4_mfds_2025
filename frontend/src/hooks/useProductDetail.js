import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';


export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  /**
   * Obtener los datos del producto desde el backend
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
      
      console.log(`Fetching product details for ID: ${productId}`);
      const productData = await productService.getProductById(productId);
      
      setProduct(productData);
      setSelectedImage(0); // Resetear imagen seleccionada
      
    } catch (err) {
      setError(err.message || 'Error al cargar el producto');
      console.error('Error fetching product details:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /**
   * Cambiar imagen seleccionada en la galería
   */
  const handleImageSelect = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  /**
   * Recargar datos del producto
   */
  const refetch = useCallback(() => {
    fetchProductData();
  }, [fetchProductData]);

  // Cargar datos del producto cuando cambia el ID
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return {
    // Estado
    product,
    loading,
    error,
    selectedImage,
    
    // Acciones
    handleImageSelect,
    refetch,
    
    // Utilidades
    hasImages: product?.images && product.images.length > 0,
    totalImages: product?.images?.length || 0,
    currentImage: product?.images?.[selectedImage] || null,
  };
};

export default useProductDetail;