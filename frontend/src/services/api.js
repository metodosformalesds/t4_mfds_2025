// src/services/api.js
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Obtener headers con autenticación
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

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Combinar headers de autenticación con headers personalizados
    const authHeaders = this.getAuthHeaders();
    const config = {
    ...options,
    headers: {
      ...authHeaders,
      ...(options.headers || {}),
    }
};

    try {
      console.log(`API Request: ${url}`, config);
      const response = await fetch(url, config);
      
      // Manejar errores de autenticación
      if (response.status === 401) {
        // Token inválido o expirado
        authService.removeToken();
        throw new Error('Authentication required. Please login again.');
      }
      
      if (response.status === 403) {
        throw new Error('Access forbidden');
      }
      
      if (!response.ok) {
        // Intentar obtener mensaje de error del backend
        try {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Cuando se elimina un item del carrito
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;

    } catch (error) {
      console.error(`API Error: ${url}`, error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();
export default apiClient;