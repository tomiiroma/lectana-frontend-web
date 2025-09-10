import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./AdminSidebar.css"

const linkStyle = ({ isActive }) => ({
  fontSize: "1em",
  fontFamily:"Inter, Inter Fallback",
  padding: "0.5rem 0.75rem",
  transition: "all 0.1s ease-in-out",
  textDecoration: "none",
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
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px"}}>
        <img src="/lectana.svg" alt="Logo" className="header-logo"/>
      <h1 style={{  fontWeight: 700 ,fontSize:"1.5em", fontFamily:"Inter, Inter Fallback", color: "#0056D2" }}>Lectana Admin</h1>
      </div>
      <hr style={{width:"100%", padding:0}}/>
      <nav style={{ display: "grid", gap: 6, marginTop:"20px"}}>
        <NavLink to="/admin" style={linkStyle} >Dashboard</NavLink>
        <NavLink to="/admin/cuentos" style={linkStyle}  className={({ isActive }) =>
    isActive ? "navlink navlink-active" : "navlink"
  }>Cuentos</NavLink>
        <NavLink to="/admin/usuarios" style={linkStyle}  className={({ isActive }) =>
    isActive ? "navlink navlink-active" : "navlink"
  }>Usuarios</NavLink>
        <NavLink to="/admin/aulas" style={linkStyle}  className={({ isActive }) =>
    isActive ? "navlink navlink-active" : "navlink"
  }>Aulas</NavLink>
        <NavLink to="/admin/actividades" style={linkStyle}  className={({ isActive }) =>
    isActive ? "navlink navlink-active" : "navlink"
  }>Actividades</NavLink>
        <NavLink to="/admin/perfil" style={linkStyle}  className={({ isActive }) =>
    isActive ? "navlink navlink-active" : "navlink"
  }>Perfil</NavLink>
      </nav>
      <div style={{ marginTop: "auto", padding: 12 }}>
        <button onClick={handleLogout} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>Cerrar sesión</button>
      </div>
    </aside>
  );
}


