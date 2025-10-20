import axios from "axios";

// Configuración base de la API
// Detectar automáticamente el entorno
const getApiUrl = () => {
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    console.log(`🔍 URL desde variable de entorno: ${url}`);
    return url;
  }
  
  // Detectar si estamos en desarrollo local
  const isLocalDev = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname === '';
  
  // Usar localhost para desarrollo, producción para deploy
  return isLocalDev 
    ? "http://localhost:3000/api"
    : "https://lectana-backend.onrender.com";
};

const apiUrl = getApiUrl();
console.log(`🌐 Usando API URL: ${apiUrl}`);
console.log(`🔍 Hostname actual: ${window.location.hostname}`);
console.log(`🔍 VITE_API_URL: ${import.meta.env.VITE_API_URL}`);

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // ← CRÍTICO: Envía cookies de autenticación
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Asegurar que siempre tengamos los headers correctos
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    config.headers['Accept'] = config.headers['Accept'] || 'application/json';
    
    // Log para debugging
    console.log(`🚀 Petición a: ${config.baseURL}${config.url}`);
    console.log(`🚀 Headers:`, config.headers);
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta exitosa de: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', error);
    
    // Manejar errores CORS específicamente
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('🚨 Error CORS detectado:', error.message);
      console.error('🚨 URL de la petición:', error.config?.url);
      console.error('🚨 Base URL:', error.config?.baseURL);
    }
    
    if (error.response?.status === 401) {
      // Token inválido o expirado
      console.log('🔐 Token inválido, redirigiendo al login');
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;


