import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: isActive ? "#0f172a" : "#334155",
  background: isActive ? "#e2e8f0" : "transparent",
  fontWeight: 500,
});

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside style={{ width: 240, padding: 12, borderRight: "1px solid #e5e7eb", background: "#f8fafc", height: "100vh", position: "sticky", top: 0 }}>
      <div style={{ padding: "8px 12px", marginBottom: 8, fontWeight: 700 }}>Lectana Admin</div>
      <nav style={{ display: "grid", gap: 6 }}>
        <NavLink to="/admin" end style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/admin/cuentos" style={linkStyle}>Cuentos</NavLink>
        <NavLink to="/admin/usuarios" style={linkStyle}>Usuarios</NavLink>
        <NavLink to="/admin/aulas" style={linkStyle}>Aulas</NavLink>
        <NavLink to="/admin/actividades" style={linkStyle}>Actividades</NavLink>
        <NavLink to="/admin/perfil" style={linkStyle}>Perfil</NavLink>
      </nav>
      <div style={{ marginTop: "auto", padding: 12 }}>
        <button onClick={handleLogout} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cerrar sesión</button>
      </div>
    </aside>
  );
}


