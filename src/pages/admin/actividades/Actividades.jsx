import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Actividades.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaClipboardList, FaQuestionCircle, FaCheckCircle, FaClock, FaUsers, FaChartBar } from "react-icons/fa";

export default function Actividades() {
  return (
    <>
      <h1 className="admin-page-title admin-actividades-title">🎯 Gestión de Actividades</h1>
      
          <AdminActionsBar btnTitle={"Nueva Actividad"} placeholderTitle={"Buscar Actividad..."} btnClassName="btnAdd" btnStyle={gradients.redGradient}/>

      <div className="admin-page-container admin-actividades-container">
        {/* Estadísticas de actividades */}
        <div className="stats-grid">

              <CardStats icon={<FaClipboardList color="#ef4444"/>} number={"89"}label={"Total Actividades"}/>
          <CardStats icon={<FaCheckCircle color="#ef4444"/>} number={"67"}label={"Estudiantes"}/>
          <CardStats icon={<FaClock color="#ef4444"/>} number={"15"}label={"En Progreso"}/>
          <CardStats icon={<FaChartBar color="#ef4444"/>} number={"8.4"}label={"Puntuación Media"}/>



      
        </div>

        {/* Filtros por tipo */}
        <div className="activity-filters">
          <button className="activity-filter active">Todas</button>
          <button className="activity-filter">Comprensión Lectora</button>
          <button className="activity-filter">Vocabulario</button>
          <button className="activity-filter">Gramática</button>
          <button className="activity-filter">Creatividad</button>
          <button className="activity-filter">Evaluaciones</button>
        </div>

        {/* Grid de actividades */}
        <div className="actividades-grid">
          <div className="actividad-card">
            <div className="actividad-header">
              <div className="actividad-type type-comprension">Comprensión</div>
              <div className="actividad-difficulty difficulty-medium">Intermedio</div>
            </div>
            <div className="actividad-content">
              <h3 className="actividad-title">El Dragón y la Princesa</h3>
              <p className="actividad-description">Actividad de comprensión lectora basada en el cuento clásico con preguntas interactivas.</p>
              
              <div className="actividad-stats">
                <div className="actividad-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>156 participantes</span>
                </div>
                <div className="actividad-stat">
                  <FaQuestionCircle className="stat-icon-small" />
                  <span>12 preguntas</span>
                </div>
                <div className="actividad-stat">
                  <FaClock className="stat-icon-small" />
                  <span>15 min aprox.</span>
                </div>
              </div>

              <div className="actividad-progress">
                <div className="progress-label">Tasa de Éxito</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                </div>
                <span className="progress-text">85%</span>
              </div>
            </div>
            <div className="actividad-actions">
              <button className="btn-action btn-view" title="Ver Resultados">
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

          <div className="actividad-card">
            <div className="actividad-header">
              <div className="actividad-type type-vocabulario">Vocabulario</div>
              <div className="actividad-difficulty difficulty-easy">Fácil</div>
            </div>
            <div className="actividad-content">
              <h3 className="actividad-title">Palabras Mágicas</h3>
              <p className="actividad-description">Juego interactivo para ampliar vocabulario con sinónimos y antónimos.</p>
              
              <div className="actividad-stats">
                <div className="actividad-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>203 participantes</span>
                </div>
                <div className="actividad-stat">
                  <FaQuestionCircle className="stat-icon-small" />
                  <span>20 palabras</span>
                </div>
                <div className="actividad-stat">
                  <FaClock className="stat-icon-small" />
                  <span>10 min aprox.</span>
                </div>
              </div>

              <div className="actividad-progress">
                <div className="progress-label">Tasa de Éxito</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '92%'}}></div>
                </div>
                <span className="progress-text">92%</span>
              </div>
            </div>
            <div className="actividad-actions">
              <button className="btn-action btn-view" title="Ver Resultados">
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

          <div className="actividad-card">
            <div className="actividad-header">
              <div className="actividad-type type-creatividad">Creatividad</div>
              <div className="actividad-difficulty difficulty-hard">Avanzado</div>
            </div>
            <div className="actividad-content">
              <h3 className="actividad-title">Crea tu Final</h3>
              <p className="actividad-description">Actividad creativa donde los estudiantes escriben finales alternativos para cuentos.</p>
              
              <div className="actividad-stats">
                <div className="actividad-stat">
                  <FaUsers className="stat-icon-small" />
                  <span>89 participantes</span>
                </div>
                <div className="actividad-stat">
                  <FaQuestionCircle className="stat-icon-small" />
                  <span>Texto libre</span>
                </div>
                <div className="actividad-stat">
                  <FaClock className="stat-icon-small" />
                  <span>30 min aprox.</span>
                </div>
              </div>

              <div className="actividad-progress">
                <div className="progress-label">Tasa de Éxito</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '78%'}}></div>
                </div>
                <span className="progress-text">78%</span>
              </div>
            </div>
            <div className="actividad-actions">
              <button className="btn-action btn-view" title="Ver Resultados">
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

          <div className="actividad-card actividad-create">
            <div className="create-content">
              <div className="create-icon">
                <FaPlus />
              </div>
              <h3>Crear Nueva Actividad</h3>
              <p>Diseña una nueva actividad educativa personalizada</p>
              <button className="btn-create">Crear Actividad</button>
            </div>
          </div>
        </div>

        {/* Tabla de rendimiento */}
        <div className="table-container" style={{marginTop: '32px'}}>
          <h3 style={{marginBottom: '16px', color: '#ef4444', fontWeight: '600'}}>Rendimiento por Actividad</h3>
          <table className="admin-table actividades-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Participantes</th>
                <th>Tasa de Éxito</th>
                <th>Tiempo Promedio</th>
                <th>Puntuación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="actividad-info">
                    <div className="actividad-icon">📖</div>
                    <div>
                      <div className="actividad-name">El Dragón y la Princesa</div>
                      <div className="actividad-code">ACT-001</div>
                    </div>
                  </div>
                </td>
                <td><span className="type-badge type-comprension">Comprensión</span></td>
                <td>156</td>
                <td>
                  <div className="success-rate">
                    <div className="rate-bar">
                      <div className="rate-fill" style={{width: '85%'}}></div>
                    </div>
                    <span>85%</span>
                  </div>
                </td>
                <td>12 min</td>
                <td>
                  <div className="score-display">8.5/10</div>
                </td>
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
                  <div className="actividad-info">
                    <div className="actividad-icon">✨</div>
                    <div>
                      <div className="actividad-name">Palabras Mágicas</div>
                      <div className="actividad-code">ACT-002</div>
                    </div>
                  </div>
                </td>
                <td><span className="type-badge type-vocabulario">Vocabulario</span></td>
                <td>203</td>
                <td>
                  <div className="success-rate">
                    <div className="rate-bar">
                      <div className="rate-fill" style={{width: '92%'}}></div>
                    </div>
                    <span>92%</span>
                  </div>
                </td>
                <td>8 min</td>
                <td>
                  <div className="score-display">9.2/10</div>
                </td>
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


