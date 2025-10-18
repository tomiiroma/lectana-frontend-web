import axios from "axios";

// Configuración base de la API
// Detectar automáticamente el entorno
const getApiUrl = () => {
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL;
    // Para producción, usar sin /api (el backend tiene ambas rutas)
    if (url.includes('lectana-backend.onrender.com')) {
      return url.replace('/api', '');
    }
    // Para local, mantener /api
    return url.endsWith('/api') ? url : `${url}/api`;
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
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;


