import { useAuth } from "../../auth/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Panel Admin</h1>
      <p>Bienvenido, {user?.nombre || user?.email || "Administrador"}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}


