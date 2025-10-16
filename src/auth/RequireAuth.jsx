import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un loading o nada
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay token o usuario, redirigir al login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si el usuario no es administrador, redirigir al home
  const role = typeof user?.rol === "string" ? user.rol.toLowerCase() : null;
  if (role !== "administrador") {
    return <Navigate to="/" replace />;
  }

  // Si todo está correcto, mostrar el contenido protegido
  return children;
}


