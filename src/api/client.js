import axios from "axios";

// En producción (Vercel) usamos proxy '/api' definido en vercel.json.
// En desarrollo usamos VITE_API_URL o fallback a localhost.
const isProd = import.meta.env.PROD;
const baseURL = isProd
  ? "/api"
  : (import.meta.env.VITE_API_URL || "http://localhost:3000/api");

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

export default api;


