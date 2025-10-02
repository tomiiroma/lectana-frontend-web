import { useCallback, useRef } from 'react';
import api from '../api/client';

// Cache global para peticiones
const requestCache = new Map();
const CACHE_TIMEOUT = 10000; // 10 segundos

/**
 * Hook personalizado para manejar peticiones API con deduplicación
 * Evita peticiones duplicadas y mejora la performance
 */
export function useApiRequest() {
  const abortControllerRef = useRef(null);

  // Función para limpiar cache expirado
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of requestCache.entries()) {
      if (now - value.timestamp > CACHE_TIMEOUT) {
        requestCache.delete(key);
      }
    }
  }, []);

  // Función para crear clave única de petición
  const createRequestKey = useCallback((method, url, params = {}) => {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${method.toUpperCase()}:${url}:${JSON.stringify(sortedParams)}`;
  }, []);

  // Función principal para hacer peticiones con deduplicación
  const makeRequest = useCallback(async (method, url, options = {}) => {
    const { params = {}, data = null, useCache = true } = options;
    const requestKey = createRequestKey(method, url, params);

    // Limpiar cache expirado
    cleanExpiredCache();

    // Si existe en cache y no ha expirado, devolver resultado cacheado
    if (useCache && requestCache.has(requestKey)) {
      const cached = requestCache.get(requestKey);
      if (Date.now() - cached.timestamp < CACHE_TIMEOUT) {
        console.log(`🔄 Usando cache para: ${requestKey}`);
        return cached.data;
      } else {
        requestCache.delete(requestKey);
      }
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    try {
      console.log(`🚀 Nueva petición: ${method.toUpperCase()} ${url}`);
      
      let response;
      const requestConfig = {
        signal: abortControllerRef.current.signal,
        ...options
      };

      switch (method.toLowerCase()) {
        case 'get':
          response = await api.get(url, { params, ...requestConfig });
          break;
        case 'post':
          response = await api.post(url, data, requestConfig);
          break;
        case 'put':
          response = await api.put(url, data, requestConfig);
          break;
        case 'patch':
          response = await api.patch(url, data, requestConfig);
          break;
        case 'delete':
          response = await api.delete(url, requestConfig);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      // Cachear respuesta si es exitosa
      if (useCache && response.status >= 200 && response.status < 300) {
        requestCache.set(requestKey, {
          data: response.data,
          timestamp: Date.now()
        });
      }

      return response.data;
    } catch (error) {
      // No cachear errores
      if (error.name === 'AbortError') {
        console.log(`⏹️ Petición cancelada: ${requestKey}`);
        throw new Error('Petición cancelada');
      }
      throw error;
    }
  }, [createRequestKey, cleanExpiredCache]);

  // Función para limpiar cache manualmente
  const clearCache = useCallback(() => {
    requestCache.clear();
    console.log('🧹 Cache de peticiones limpiado');
  }, []);

  // Función para cancelar petición en curso
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Limpiar al desmontar
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    makeRequest,
    clearCache,
    cancelRequest,
    cleanup,
    // Métodos de conveniencia
    get: (url, options) => makeRequest('get', url, options),
    post: (url, data, options) => makeRequest('post', url, { data, ...options }),
    put: (url, data, options) => makeRequest('put', url, { data, ...options }),
    patch: (url, data, options) => makeRequest('patch', url, { data, ...options }),
    delete: (url, options) => makeRequest('delete', url, options)
  };
}
