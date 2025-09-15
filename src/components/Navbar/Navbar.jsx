import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import "./Navbar.css";
import { FaSignInAlt, FaSignOutAlt, FaUserCircle, FaCog, FaUser, FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    return user.nombre || user.name || "Usuario";
  };

  const getUserRole = () => {
    if (!user?.rol) return "";
    const role = user.rol.toLowerCase();
    if (role === "administrador") return "Admin";
    if (role === "docente") return "Docente";
    if (role === "estudiante") return "Estudiante";
    return role;
  };

  const handleSmoothScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-brand">
          <img src="/lectana.svg" alt="Logo" className="header-logo" />
          <span className="header-title">Lectana</span>
        </Link>

        {/* Navigation Menu */}
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <button 
                className="navbar-link" 
                onClick={() => handleSmoothScroll('biblioteca')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Biblioteca
              </button>
            </li>
            <li className="navbar-item">
              <button 
                className="navbar-link" 
                onClick={() => handleSmoothScroll('categorias')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Categorías
              </button>
            </li>
            <li className="navbar-item">
              <button 
                className="navbar-link" 
                onClick={() => handleSmoothScroll('docentes')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Docentes
              </button>
            </li>
            <li className="navbar-item">
              <button 
                className="navbar-link" 
                onClick={() => handleSmoothScroll('contacto')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Contacto
              </button>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="header-actions">
          {token && user ? (
            // Usuario logueado
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="user-avatar">
                  <FaUserCircle />
                </div>
                <div className="user-info">
                  <span className="user-name">{getUserDisplayName()}</span>
                  <span className="user-role">{getUserRole()}</span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="dropdown-info">
                      <span className="dropdown-name">{getUserDisplayName()}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="dropdown-menu">
                    {user.rol?.toLowerCase() === "administrador" && (
                      <Link to="/admin" className="dropdown-item">
                        <FaCog />
                        Panel Admin
                      </Link>
                    )}
                    <Link to="/perfil" className="dropdown-item">
                      <FaUser />
                      Mi Perfil
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Usuario no logueado
            <div className="auth-buttons">
              <button 
                onClick={toggleTheme}
                className="theme-toggle-button"
                title={`Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`}
              >
                {isDark ? <FaSun /> : <FaMoon />}
              </button>
              <Link to="/login" className="login-button">
                <FaSignInAlt />
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;