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

 const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    
    if (response.data?.ok) {
      const { token, user, role } = response.data;
      
      if (!token || !user) {
        throw new Error("Respuesta del servidor incompleta");
      }
      
      const usuario = { ...user, rol: role || user.rol };
      
      // Guardar token y usuario
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));
      
      setToken(token);
      setUser(usuario);
      
      return { success: true };
    } else {
      throw new Error(response.data?.error || "Error de autenticación");
    }
  } catch (error) {
    console.error("Error en login:", error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message || "Error de conexión" 
    };
  }
};

  // Función de logout
  const logout = async () => {
    // Intentar notificar al backend (opcional)
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continuar con el logout local aunque falle la notificación
    }
    
    // Limpiar estado local
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Verificar token al inicializar
  useEffect(() => {
    const checkToken = async () => {
      if (token && !user) {
        // Primero intentar recuperar del localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing saved user:", error);
            localStorage.removeItem("user");
          }
        }
        
        // Si no hay usuario guardado, verificar con el servidor
        try {
          const res = await api.post("/auth/verify");
          if (res.data?.usuario) {
            setUser(res.data.usuario);
            localStorage.setItem("user", JSON.stringify(res.data.usuario));
          }
        } catch (error) {
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


