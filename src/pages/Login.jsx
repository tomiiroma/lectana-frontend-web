import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Login.css";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaArrowLeft } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (token && user) {
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    }
  }, [token, user, navigate, location]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirigir a la página desde donde vino o al admin
        const from = location.state?.from?.pathname || "/admin";
        navigate(from, { replace: true });
      } else {
        setError(result.message || "Error de autenticación");
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError("Error de conexión. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header con navegación de regreso */}
        <div className="login-header">
          <button onClick={() => navigate("/")} className="back-button">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </button>
          <div className="login-logo">
            <img src="/lectana.svg" alt="Lectana" />
            <h1>Lectana</h1>
          </div>
        </div>

        {/* Formulario de login */}
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>¡Bienvenido de vuelta!</h2>
            <p>Inicia sesión para continuar tu aventura de lectura</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <div className="label-with-icon">
                <FaUser className="label-icon" />
                <label>Email</label>
              </div>
              <div className="input-container">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  maxLength={30}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-with-icon">
                <FaLock className="label-icon" />
                <label>Contraseña</label>
              </div>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  maxLength={20}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes una cuenta?{" "}
              <a href="#" className="register-link">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="login-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
}