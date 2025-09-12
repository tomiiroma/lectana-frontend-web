import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const { token, isAdmin } = useAuth();
  
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  
  return children;
}


