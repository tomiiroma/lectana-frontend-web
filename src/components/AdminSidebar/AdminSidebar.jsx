import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../../auth/AuthContext"; // Desactivado - sin backend
import "./AdminSidebar.css";
import { RiLayoutMasonryLine } from "react-icons/ri";
import { FaBook, FaUser,FaBuilding,FaClipboardList,FaRegUser  } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";



export default function AdminSidebar() {
  // const { logout } = useAuth(); // Desactivado - sin backend
  const navigate = useNavigate();

  function handleLogout() {
    // Función simplificada sin autenticación real
    navigate("/", { replace: true });
  }

  return (
    <aside
      style={{
          width: 240,
    padding: 12,
    borderRight: "3px solid #3b82f6",
    background: "linear-gradient(180deg, #1e293b 0%, #334155 100%)",
    height: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(59, 130, 246, 0.15)"
      }}
    >
      <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <img src="/lectana.svg" alt="Logo" className="header-logo" />
        <h1
          style={{
            fontWeight: 700,
            fontSize: "1.5em",
            fontFamily: "Inter, Inter Fallback",
            color: "#60a5fa",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Lectana Admin
        </h1>
      </div>
      <hr style={{ 
        width: "100%", 
        padding: 0, 
        border: "none",
        height: "2px",
        background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
        borderRadius: "2px",
        margin: "16px 0"
      }} />
      <nav style={{ display: "grid", gap: 6, marginTop: "20px" }}>
        <NavLink to="/admin" end className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }>
          <RiLayoutMasonryLine color="#60a5fa" size={18} /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/cuentos"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaBook color="#f59e0b" size={18} />
          Cuentos
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaUser color="#10b981" size={18}/>
          Usuarios
        </NavLink>
        <NavLink
          to="/admin/aulas"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaBuilding color="#8b5cf6" size={18}/>
          Aulas
        </NavLink>
        <NavLink
          to="/admin/actividades"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaClipboardList color="#ef4444" size={18}/>
          Actividades
        </NavLink>
        <NavLink
          to="/admin/perfil"          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          <FaRegUser color="#06b6d4" size={18}/>
          Perfil
        </NavLink>
      </nav>

      </div>

      <div style={{ marginTop: "auto", padding: 12 }}>
       <button onClick={handleLogout} className="logout-link"> <FiLogOut size={18} /> Cerrar Sesión</button>
        </div>
    </aside>
  );
}
