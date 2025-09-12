import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#0056D2'
      }}>
        Verificando autenticación...
      </div>
    );
  }

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay token pero no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si es una ruta de administrador
  if (location.pathname.startsWith('/admin')) {
    // Solo permitir acceso a administradores
    if (user.rol?.toLowerCase() !== 'administrador') {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#ef4444',
          textAlign: 'center'
        }}>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos de administrador para acceder a esta sección.</p>
          <button 
            onClick={() => window.history.back()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0056D2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Volver
          </button>
        </div>
      );
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
}


