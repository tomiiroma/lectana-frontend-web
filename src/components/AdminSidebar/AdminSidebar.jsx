import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./AdminSidebar.css";
import { RiLayoutMasonryLine } from "react-icons/ri";
import { FaBook, FaUser,FaBuilding,FaClipboardList,FaRegUser  } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";



export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside
      style={{
          width: 240,
    padding: 12,
    borderRight: "1px solid #e5e7eb",
    background: "#f8fafc",
    height: "100vh",
    position: "sticky",
    top: 0,
    display: "flex",
    flexDirection: "column",
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
            color: "#0056D2",
          }}
        >
          Lectana Admin
        </h1>
      </div>
      <hr style={{ width: "100%", padding: 0 }} />
      <nav style={{ display: "grid", gap: 6, marginTop: "20px" }}>
        <NavLink to="/admin" end className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }>
          {" "}
          <RiLayoutMasonryLine color="#0056D2" size={16} /> Dashboard
        </NavLink>
        <NavLink
          to="/admin/cuentos"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        >
          {" "}
          <FaBook color="#0056D2" size={16} />
          Cuentos
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        ><FaUser color="#0056D2" size={16}/>

          Usuarios
        </NavLink>
        <NavLink
          to="/admin/aulas"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        > <FaBuilding color="#0056D2" size={16}/>

          Aulas
        </NavLink>
        <NavLink
          to="/admin/actividades"
          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        ><FaClipboardList color="#0056D2" size={16}/>

          Actividades
        </NavLink>
        <NavLink
          to="/admin/perfil"          className={({ isActive }) =>
            isActive ? "navlink navlink-active" : "navlink"
          }
        ><FaRegUser color="#0056D2" size={16}/>

          Perfil
        </NavLink>
      </nav>

      </div>

      <div style={{ marginTop: "auto", padding: 12 }}>
       <a href="" className="logout-link"> <FiLogOut size={16} /> Cerrar Sesion</a>
        </div>
    </aside>
  );
}
