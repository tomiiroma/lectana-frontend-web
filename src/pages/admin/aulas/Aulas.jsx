import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Aulas.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaUsers, FaChalkboardTeacher, FaGraduationCap, FaClock } from "react-icons/fa";


export default function Aulas() {
  return (
    <>
      <h1 className="admin-page-title admin-aulas-title">🏫 Gestión de Aulas</h1>
      
        <AdminActionsBar btnTitle={"Nueva Aula"} placeholderTitle={"Filtrar por Codigo"} btnClassName="btnAdd" btnStyle={gradients.purpleGradient}/>


      <div className="admin-page-container admin-aulas-container">
        {/* Estadísticas de aulas */}
        <div className="stats-grid">
          <div className="stat-card stat-card-aulas-purple">
            <div className="stat-icon">
              <FaGraduationCap />
            </div>
            <div className="stat-number">47</div>
            <div className="stat-label">Aulas Activas</div>
          </div>
          <div className="stat-card stat-card-aulas-blue">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-number">1,284</div>
            <div className="stat-label">Estudiantes</div>
          </div>
          <div className="stat-card stat-card-aulas-green">
            <div className="stat-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="stat-number">52</div>
            <div className="stat-label">Docentes</div>
          </div>
          <div className="stat-card stat-card-aulas-orange">
            <div className="stat-icon">
              <FaClock />
            </div>
            <div className="stat-number">95%</div>
            <div className="stat-label">Ocupación</div>
          </div>
        </div>

        {/* Vista de tarjetas de aulas */}
        <div className="aulas-grid">
          <div className="aula-card">
            <div className="aula-header">
              <div className="aula-grade">5° Grado A</div>
              <div className="aula-status status-active">Activa</div>
            </div>
            <div className="aula-content">
              <h3 className="aula-title">Aventuras de Lectura</h3>
              <p className="aula-description">Aula dedicada a la lectura comprensiva y creativa para estudiantes de quinto grado.</p>
              
              <div className="aula-stats">
                <div className="aula-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>28 estudiantes</span>
                </div>
                <div className="aula-stat">
                  <FaChalkboardTeacher className="stat-icon-small" />
                  <span>Prof. María González</span>
                </div>
              </div>
              
              <div className="aula-progress">
                <div className="progress-label">Progreso General</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '78%'}}></div>
                </div>
                <span className="progress-text">78%</span>
              </div>
            </div>
            <div className="aula-actions">
              <button className="btn-action btn-view" title="Ver Detalles">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Eliminar">
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="aula-card">
            <div className="aula-header">
              <div className="aula-grade">3° Grado B</div>
              <div className="aula-status status-active">Activa</div>
            </div>
            <div className="aula-content">
              <h3 className="aula-title">Cuentos Mágicos</h3>
              <p className="aula-description">Espacio para descubrir el mundo fantástico de los cuentos y desarrollar la imaginación.</p>
              
              <div className="aula-stats">
                <div className="aula-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>24 estudiantes</span>
                </div>
                <div className="aula-stat">
                  <FaChalkboardTeacher className="stat-icon-small" />
                  <span>Prof. Carlos Mendez</span>
                </div>
              </div>
              
              <div className="aula-progress">
                <div className="progress-label">Progreso General</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '92%'}}></div>
                </div>
                <span className="progress-text">92%</span>
              </div>
            </div>
            <div className="aula-actions">
              <button className="btn-action btn-view" title="Ver Detalles">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Eliminar">
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="aula-card">
            <div className="aula-header">
              <div className="aula-grade">6° Grado A</div>
              <div className="aula-status status-inactive">Inactiva</div>
            </div>
            <div className="aula-content">
              <h3 className="aula-title">Literatura Juvenil</h3>
              <p className="aula-description">Exploración de textos más complejos y desarrollo de habilidades críticas de lectura.</p>
              
              <div className="aula-stats">
                <div className="aula-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>30 estudiantes</span>
                </div>
                <div className="aula-stat">
                  <FaChalkboardTeacher className="stat-icon-small" />
                  <span>Prof. Ana Ruiz</span>
                </div>
              </div>
              
              <div className="aula-progress">
                <div className="progress-label">Progreso General</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '45%'}}></div>
                </div>
                <span className="progress-text">45%</span>
              </div>
            </div>
            <div className="aula-actions">
              <button className="btn-action btn-view" title="Ver Detalles">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Eliminar">
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="aula-card aula-create">
            <div className="create-content">
              <div className="create-icon">
                <FaPlus />
              </div>
              <h3>Crear Nueva Aula</h3>
              <p>Configura un nuevo espacio de aprendizaje para tus estudiantes</p>
              <button className="btn-create">Crear Aula</button>
            </div>
          </div>
        </div>

        {/* Tabla resumen */}
        <div className="table-container" style={{marginTop: '32px'}}>
          <h3 style={{marginBottom: '16px', color: '#8b5cf6', fontWeight: '600'}}>Resumen de Aulas</h3>
          <table className="admin-table aulas-table">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Grado</th>
                <th>Docente</th>
                <th>Estudiantes</th>
                <th>Progreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="aula-info">
                    <div className="aula-icon">🎒</div>
                    <div>
                      <div className="aula-name">Aventuras de Lectura</div>
                      <div className="aula-code">AULA-001</div>
                    </div>
                  </div>
                </td>
                <td>5° Grado A</td>
                <td>María González</td>
                <td>28</td>
                <td>
                  <div className="mini-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <span>78%</span>
                  </div>
                </td>
                <td><span className="status-badge status-active">Activa</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="aula-info">
                    <div className="aula-icon">✨</div>
                    <div>
                      <div className="aula-name">Cuentos Mágicos</div>
                      <div className="aula-code">AULA-002</div>
                    </div>
                  </div>
                </td>
                <td>3° Grado B</td>
                <td>Carlos Mendez</td>
                <td>24</td>
                <td>
                  <div className="mini-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{width: '92%'}}></div>
                    </div>
                    <span>92%</span>
                  </div>
                </td>
                <td><span className="status-badge status-active">Activa</span></td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


