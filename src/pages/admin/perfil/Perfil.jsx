import "../AdminPages.css";
import "./Perfil.css";
import { FaSave, FaEdit, FaKey, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt, FaBell, FaPalette, FaLanguage, FaClock } from "react-icons/fa";

export default function Perfil() {
  return (
    <>
      <h1 className="admin-page-title admin-perfil-title">⚙️ Mi Perfil</h1>
      
      <div className="perfil-layout">
        {/* Panel Izquierdo - Info Personal */}
        <div className="perfil-left">
          <div className="perfil-card">
            <div className="perfil-header">
              <div className="perfil-avatar">
                <img src="https://via.placeholder.com/120" alt="Avatar" />
                <button className="avatar-edit-btn">
                  <FaEdit />
                </button>
              </div>
              <div className="perfil-info">
                <h2>Ana Ruiz</h2>
                <p className="perfil-role">Administrador Principal</p>
                <p className="perfil-id">ID: #ADM001</p>
              </div>
            </div>
            
            <div className="perfil-stats">
              <div className="stat-item">
                <span className="stat-label">Miembro desde</span>
                <span className="stat-value">Enero 2024</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última actividad</span>
                <span className="stat-value">Hace 2 minutos</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sesiones totales</span>
                <span className="stat-value">847</span>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaClock /> Actividad Reciente
            </h3>
            <div className="activity-timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p><strong>Creó nueva actividad</strong></p>
                  <span className="timeline-time">Hace 1 hora</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p><strong>Editó usuario "María González"</strong></p>
                  <span className="timeline-time">Hace 3 horas</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p><strong>Publicó cuento "El Robot Amigable"</strong></p>
                  <span className="timeline-time">Ayer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Configuraciones */}
        <div className="perfil-right">
          {/* Información Personal */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaUser /> Información Personal
            </h3>
            <form className="perfil-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" value="Ana" />
                </div>
                <div className="form-group">
                  <label>Apellido</label>
                  <input type="text" value="Ruiz" />
                </div>
              </div>
              
              <div className="form-group">
                <label><FaEnvelope /> Email</label>
                <input type="email" value="ana.ruiz@lectana.com" />
              </div>
              
              <div className="form-group">
                <label><FaPhone /> Teléfono</label>
                <input type="tel" value="+1 234 567 8900" />
              </div>
              
              <div className="form-group">
                <label><FaCalendarAlt /> Fecha de Nacimiento</label>
                <input type="date" value="1990-05-15" />
              </div>
              
              <button type="submit" className="btn-save">
                <FaSave /> Guardar Cambios
              </button>
            </form>
          </div>

          {/* Seguridad */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaShieldAlt /> Seguridad
            </h3>
            <div className="security-section">
              <div className="security-item">
                <div className="security-info">
                  <h4>Cambiar Contraseña</h4>
                  <p>Actualiza tu contraseña regularmente para mayor seguridad</p>
                </div>
                <button className="btn-security">
                  <FaKey /> Cambiar
                </button>
              </div>
              
              <div className="security-item">
                <div className="security-info">
                  <h4>Autenticación en Dos Pasos</h4>
                  <p>Agrega una capa extra de seguridad a tu cuenta</p>
                </div>
                <button className="btn-security">
                  Configurar
                </button>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaPalette /> Preferencias
            </h3>
            <div className="preferences-section">
              <div className="preference-item">
                <div className="preference-info">
                  <FaBell />
                  <div>
                    <h4>Notificaciones</h4>
                    <p>Recibir alertas por email</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <FaLanguage />
                  <div>
                    <h4>Idioma</h4>
                    <p>Idioma de la interfaz</p>
                  </div>
                </div>
                <select className="preference-select">
                  <option>Español</option>
                  <option>English</option>
                  <option>Français</option>
                </select>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <FaPalette />
                  <div>
                    <h4>Tema</h4>
                    <p>Apariencia del sistema</p>
                  </div>
                </div>
                <select className="preference-select">
                  <option>Claro</option>
                  <option>Oscuro</option>
                  <option>Automático</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estadísticas Personales */}
          <div className="perfil-card">
            <h3 className="card-title">Mis Estadísticas</h3>
            <div className="personal-stats">
              <div className="personal-stat">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-number">23</div>
                  <div className="stat-label">Cuentos Creados</div>
                </div>
              </div>
              
              <div className="personal-stat">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Usuarios Gestionados</div>
                </div>
              </div>
              
              <div className="personal-stat">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <div className="stat-number">89</div>
                  <div className="stat-label">Actividades Diseñadas</div>
                </div>
              </div>
              
              <div className="personal-stat">
                <div className="stat-icon">⏱️</div>
                <div className="stat-content">
                  <div className="stat-number">247h</div>
                  <div className="stat-label">Horas de Administración</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


