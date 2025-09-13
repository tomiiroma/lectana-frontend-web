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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas y errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;


