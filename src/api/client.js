import axios from "axios";

// En producción (Vercel) usamos proxy '/api' definido en vercel.json.
// En desarrollo usamos VITE_API_URL o fallback a localhost.
const isProd = import.meta.env.PROD;
let baseURL;
if (isProd) {
  baseURL = "/api";
} else {
  const envBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Normaliza para que siempre termine en /api en desarrollo
  baseURL = envBase.endsWith("/api") ? envBase : `${envBase.replace(/\/$/, "")}/api`;
}

const api = axios.create({
  baseURL,
});

// Cache para evitar peticiones duplicadas
const requestCache = new Map();
const CACHE_TIMEOUT = 5000; // 5 segundos

// Función para limpiar cache expirado
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_TIMEOUT) {
      requestCache.delete(key);
    }
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Limpiar cache expirado
  cleanExpiredCache();
  
  return config;
});

// Variable para controlar redirecciones múltiples
let isRedirecting = false;
let redirectTimeout = null;

// Interceptor para manejar respuestas y errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Evitar múltiples redirecciones simultáneas
      if (isRedirecting) {
        return Promise.reject(error);
      }
      
      // Token expirado o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        isRedirecting = true;
        
        // Usar timeout para evitar redirecciones múltiples
        if (redirectTimeout) {
          clearTimeout(redirectTimeout);
        }
        
        redirectTimeout = setTimeout(() => {
          // Usar replace para no agregar al historial
          window.location.replace("/login");
          isRedirecting = false;
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


