import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./Navbar.css";
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaUserCircle, FaCog } from "react-icons/fa";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
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

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-brand">
          <img src="/lectana.svg" alt="Logo" className="header-logo" />
          <span className="header-title">Lectana</span>
        </Link>

        {/* Navigation Menu */}
        <nav className={`navbar ${isMobileMenuOpen ? "navbar-open" : ""}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <a className="navbar-link" href="#biblioteca">Biblioteca</a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="#categorias">Categorías</a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="#docentes">Docentes</a>
            </li>
            <li className="navbar-item">
              <a className="navbar-link" href="#contacto">Contacto</a>
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
              <Link to="/login" className="login-button">
                <FaSignInAlt />
                <span>Iniciar Sesión</span>
              </Link>
              <Link to="/registro" className="register-button">
                <FaUser />
                <span>Registrarse</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <nav className="mobile-nav">
              <a href="#biblioteca" className="mobile-nav-link">Biblioteca</a>
              <a href="#categorias" className="mobile-nav-link">Categorías</a>
              <a href="#docentes" className="mobile-nav-link">Docentes</a>
              <a href="#contacto" className="mobile-nav-link">Contacto</a>
            </nav>
            
            {token && user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <FaUserCircle />
                  <div>
                    <span className="mobile-user-name">{getUserDisplayName()}</span>
                    <span className="mobile-user-role">{getUserRole()}</span>
                  </div>
                </div>
                <div className="mobile-user-actions">
                  {user.rol?.toLowerCase() === "administrador" && (
                    <Link to="/admin" className="mobile-action-button">
                      Panel Admin
                    </Link>
                  )}
                  <Link to="/perfil" className="mobile-action-button">
                    Mi Perfil
                  </Link>
                  <button onClick={handleLogout} className="mobile-action-button logout">
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-section">
                <Link to="/login" className="mobile-login-button">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="mobile-register-button">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;