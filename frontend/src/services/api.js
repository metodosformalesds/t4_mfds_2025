/*
  Autor: Erick Rangel
  Fecha: 14-11-2025
  Servicio: api.js
  Descripción: Cliente HTTP centralizado para comunicación con el backend
*/
import { authService } from './authService';
const API_BASE_URL = import.meta.env.VITE_API_URL

class ApiClient {
  /*
  Autor: Erick Rangel
  
  Descripción: Constructor del cliente API
  
  Parámetros: baseURL - URL base del API (opcional)
  
  Retorna: Instancia de ApiClient
  */
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Obtiene headers de autenticación incluyendo el token JWT
  
  Parámetros: ninguno
  
  Retorna: Objeto con headers incluyendo Authorization si hay token
  */
  getAuthHeaders() {
    const token = authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Realiza una petición HTTP al servidor con manejo de errores y autenticación
  
  Parámetros: endpoint - Ruta del endpoint, options - Opciones de configuración de fetch
  
  Retorna: Datos de respuesta del servidor o null si es 204
  */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const authHeaders = this.getAuthHeaders();
    const config = {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      }
    };

    if (config.body instanceof FormData) {
      if (config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        authService.removeToken();
        throw new Error('Authentication required. Please login again.');
      }
      
      if (response.status === 403) {
        throw new Error('Access forbidden');
      }
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      throw error;
    }
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Realiza petición GET con parámetros de query
  
  Parámetros: endpoint - Ruta del endpoint, params - Objeto con parámetros de query
  
  Retorna: Datos de respuesta del servidor
  */
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Realiza petición POST con datos JSON
  
  Parámetros: endpoint - Ruta del endpoint, data - Datos a enviar
  
  Retorna: Datos de respuesta del servidor
  */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Realiza petición PUT con datos JSON
  
  Parámetros: endpoint - Ruta del endpoint, data - Datos a actualizar
  
  Retorna: Datos de respuesta del servidor
  */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /*
  Autor: Erick Rangel
  
  Descripción: Realiza petición DELETE
  
  Parámetros: endpoint - Ruta del endpoint
  
  Retorna: Datos de respuesta del servidor
  */
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;