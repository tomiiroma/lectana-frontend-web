import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login({ email, password }) {
    try {
      const res = await api.post("/api/auth/login", { email, password });
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
      return { jwt, usuario };
    } catch (err) {
      const serverMsg = err?.response?.data?.error;
      const status = err?.response?.status;
      if (serverMsg) throw new Error(serverMsg);
      if (status === 401) throw new Error("Credenciales inválidas");
      throw new Error(err?.message || "Error de login");
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => {
    const role = typeof user?.rol === "string" ? user.rol.toLowerCase() : null;
    return { token, user, isAdmin: role === "administrador", login, logout };
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}


