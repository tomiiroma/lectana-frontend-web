import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // REACTIVADO - Con autenticación
import { useTheme } from "../../contexts/ThemeContext";
import "./AdminSidebar.css";
import { RiLayoutMasonryLine } from "react-icons/ri";
import { FaBook, FaUser,FaBuilding,FaClipboardList,FaRegUser, FaMoon, FaSun  } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";



export default function AdminSidebar() {
  const { logout, user } = useAuth(); // REACTIVADO - Con autenticación
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();

  function handleLogout() {
    logout();
    navigate("/login", { replace: false });
  }

  return (
    <aside
      style={{
          width: 240,
    padding: 12,
    borderRight: "3px solid var(--sidebar-border)",
    background: "var(--sidebar-bg)",
    height: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "var(--shadow-medium)"
      }}
    >
      <div>
      <NavLink 
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => e.target.closest('a').style.transform = "scale(1.02)"}
        onMouseLeave={(e) => e.target.closest('a').style.transform = "scale(1)"}
      >
        <img src="/lectana.svg" alt="Logo" className="header-logo" />
        <h1
          style={{
            fontWeight: 700,
            fontSize: "1.5em",
            fontFamily: "Inter, Inter Fallback",
            color: "var(--sidebar-title)",
            textShadow: "var(--shadow-light)",
            transition: "color 0.2s ease",
          }}
        >
          Lectana Admin
        </h1>
      </NavLink>
      <hr style={{ 
        width: "100%", 
        padding: 0, 
        border: "none",
        height: "2px",
        background: "linear-gradient(90deg, var(--secondary-color), var(--primary-color), var(--accent-color))",
        borderRadius: "2px",
        margin: "16px 0"
      }} />
      <nav style={{ display: "grid", gap: 6, marginTop: "20px" }}>
        <NavLink to="/admin" end className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }>
          <RiLayoutMasonryLine style={{color: "var(--text-accent)"}} size={18} /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/cuentos"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaBook style={{color: "var(--warning-color)"}} size={18} />
          Cuentos
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaUser style={{color: "var(--success-color)"}} size={18}/>
          Usuarios
        </NavLink>
        <NavLink
          to="/admin/aulas"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaBuilding style={{color: "var(--primary-color)"}} size={18}/>
          Aulas
        </NavLink>
        <NavLink
          to="/admin/actividades"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaClipboardList style={{color: "var(--danger-color)"}} size={18}/>
          Actividades
        </NavLink>
        <NavLink
          to="/admin/perfil"          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaRegUser style={{color: "var(--info-color)"}} size={18}/>
          Perfil
        </NavLink>
      </nav>

      </div>

      <div style={{ marginTop: "auto", padding: 12 }}>
        {user && (
          <div style={{ 
            marginBottom: 12, 
            padding: 10, 
            borderRadius: 8, 
            background: "var(--sidebar-user-bg)",
            border: "1px solid var(--sidebar-user-border)",
            fontSize: "13px",
            color: "var(--text-secondary)"
          }}>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: 4, 
              color: "var(--text-primary)",
              fontSize: "14px"
            }}>
              {user.nombre || user.email}
            </div>
            <div style={{ 
              color: "var(--text-tertiary)",
              fontSize: "12px"
            }}>
              {user.rol || "Administrador"}
            </div>
          </div>
        )}
        <button 
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <FaSun size={18} color="#fbbf24" /> : <FaMoon size={18} color="#60a5fa" />}
          {isDark ? "Modo Claro" : "Modo Oscuro"}
        </button>
        <button onClick={handleLogout} className="logout-link"> <FiLogOut size={18} /> Cerrar Sesión</button>
        </div>
    </aside>
  );
}
