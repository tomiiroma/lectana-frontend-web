import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // Verificar token al inicializar
  useEffect(() => {
    const checkToken = async () => {
      if (token && !user) {
        try {
          // Intentar obtener información del usuario con el token existente
          const res = await api.get("/auth/verify");
          if (res.data?.usuario) {
            setUser(res.data.usuario);
          }
        } catch (error) {
          // Si el token es inválido, limpiar
          console.log("Token inválido, limpiando autenticación");
          setToken(null);
          setUser(null);
        }
      }
    };

    checkToken();
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


