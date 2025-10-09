import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../api/client";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Función de login
  const login = async (credentials) => {
    try {
      console.log("🔐 Iniciando login...");
      const response = await api.post("/auth/login", credentials);
      
      if (response.data?.ok) {
        const { token: newToken, usuario } = response.data.data;
        
        // Guardar token y usuario
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(usuario));
        
        setToken(newToken);
        setUser(usuario);
        
        console.log("✅ Login exitoso");
        return { success: true };
      } else {
        throw new Error(response.data?.error || "Error de autenticación");
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || "Error de conexión" 
      };
    }
  };

  // Función de logout
  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Verificar token al inicializar
  useEffect(() => {
    const checkToken = async () => {
      if (token && !user) {
        try {
          console.log("🔍 Verificando token...");
          const res = await api.get("/auth/verify");
          if (res.data?.usuario) {
            setUser(res.data.usuario);
            console.log("✅ Token verificado correctamente");
          }
        } catch (error) {
          console.log("❌ Token inválido, limpiando autenticación");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token, user]);

  // Recuperar usuario del localStorage si existe
  useEffect(() => {
    if (token && !user) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, [token, user]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.rol?.toLowerCase() === "administrador"
  }), [user, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


