import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  
  // Referencias para controlar verificaciones
  const verificationTimeoutRef = useRef(null);
  const lastVerificationRef = useRef(0);
  const isVerifyingRef = useRef(false);

  // Verificar token al inicializar con throttling
  useEffect(() => {
    const checkToken = async () => {
      // Evitar verificaciones múltiples simultáneas
      if (isVerifyingRef.current) {
        return;
      }

      // Throttling: solo verificar si han pasado al menos 5 segundos desde la última verificación
      const now = Date.now();
      if (now - lastVerificationRef.current < 5000) {
        return;
      }

      if (token && !user) {
        isVerifyingRef.current = true;
        lastVerificationRef.current = now;

        try {
          console.log("🔍 Verificando token...");
          const res = await api.get("/auth/verify");
          if (res.data?.usuario) {
            setUser(res.data.usuario);
            console.log("✅ Token verificado correctamente");
          }
        } catch (error) {
          // Si el token es inválido, limpiar sin redireccionar automáticamente
          console.log("❌ Token inválido, limpiando autenticación");
          setToken(null);
          setUser(null);
          // No redireccionar aquí para evitar bucles de navegación
        } finally {
          isVerifyingRef.current = false;
        }
      }
    };

    // Limpiar timeout anterior
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
    }

    // Ejecutar verificación con delay para evitar verificaciones inmediatas múltiples
    verificationTimeoutRef.current = setTimeout(checkToken, 100);

    // Cleanup
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
    };
  }, [token, user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });
      const payload = res?.data ?? {};
      const ok = typeof payload.ok === "boolean" ? payload.ok : true;
      if (!ok) throw new Error(payload?.error || "Credenciales inválidas");

      const container = payload && typeof payload.data === "object" ? payload.data : payload;
      const jwt = container?.token || container?.jwt || container?.accessToken;
      const usuarioBase = container?.usuario || container?.user;
      const role = container?.role || container?.rol || usuarioBase?.rol;

      if (!jwt || !usuarioBase) {
        throw new Error("Formato de respuesta no esperado del servidor");
      }

      const usuario = role ? { ...usuarioBase, rol: role } : usuarioBase;

      setToken(jwt);
      setUser(usuario);
      return { success: true, jwt, usuario };
    } catch (err) {
      const serverMsg = err?.response?.data?.error;
      const status = err?.response?.status;
      let message = "Error de login";
      
      if (serverMsg) {
        message = serverMsg;
      } else if (status === 401) {
        message = "Credenciales inválidas";
      } else if (err?.message) {
        message = err.message;
      }
      
      return { success: false, message };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => {
    const role = typeof user?.rol === "string" ? user.rol.toLowerCase() : null;
    return { token, user, loading, isAdmin: role === "administrador", login, logout };
  }, [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}


