import { useState, useEffect, useCallback } from "react";
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import AulasCard from "../../../components/Cards/AulasCard/AulasCard";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import CreateAulaModal from "../../../components/Modals/CreateAulaModal/CreateAulaModal";
import ConfigureAulaModal from "../../../components/Modals/ConfigureAulaModal/ConfigureAulaModal";
import ViewAulaModal from "../../../components/Modals/ViewAulaModal/ViewAulaModal";
import EditAulaModal from "../../../components/Modals/EditAulaModal/EditAulaModal";
import { gradients } from "../../../styles/Gradients";
import { statusStyles } from "../../../styles/statusStyle";
import { listarAulas, obtenerEstadisticasAulas, obtenerAulaPorId } from "../../../api/aulas";
import { obtenerEstadisticasUsuarios } from "../../../api/administradores";
import { useApiRequest } from "../../../hooks/useApiRequest";
import "../AdminPages.css";
import "./Aulas.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaUsers, FaChalkboardTeacher, FaGraduationCap, FaClock } from "react-icons/fa";
import BtnEdit from "../../../components/Buttons/ActionButtons/btnEdit";
import BtnDelete from "../../../components/Buttons/ActionButtons/btnDelete";
import BtnView from "../../../components/Buttons/ActionButtons/btnView";
export default function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openConfigureModal, setOpenConfigureModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAulaId, setSelectedAulaId] = useState(null);
  const [newAulaData, setNewAulaData] = useState(null);
  const [stats, setStats] = useState({
    totalAulas: 0,
    totalEstudiantes: 0,
    totalDocentes: 0,
    loading: true
  });

  // Hook para manejar peticiones API con deduplicación
  const { get, cleanup } = useApiRequest();

  // Cargar aulas y estadísticas al montar el componente
  useEffect(() => {
    fetchAulas();
    fetchStats();
    
    // Cleanup al desmontar
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const fetchAulas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Cargando lista de aulas...");
      const aulasData = await listarAulas();
      console.log("Aulas cargadas:", aulasData);
      console.log("Primera aula (ejemplo):", aulasData[0]);
      
      // Si hay aulas, obtener datos completos para cada una
      if (aulasData && aulasData.length > 0) {
        console.log("Obteniendo datos completos para cada aula...");
        const aulasCompletas = await Promise.all(
          aulasData.map(async (aula) => {
            try {
              const aulaCompleta = await obtenerAulaPorId(aula.id_aula);
              return aulaCompleta || aula;
            } catch (error) {
              console.warn(`Error obteniendo datos completos del aula ${aula.id_aula}:`, error);
              return aula; // Usar datos básicos si falla
            }
          })
        );
        console.log("Aulas completas obtenidas:", aulasCompletas);
        setAulas(aulasCompletas);
      } else {
        setAulas([]);
      }
    } catch (error) {
      console.error("Error cargando aulas:", error);
      
      // Verificar si es un error específico del backend
      if (error.response?.status === 500) {
        setError("Error del servidor: Problema con la consulta de aulas. El backend está intentando acceder a campos que no existen en la tabla docente.");
      } else {
        setError("Error al cargar las aulas");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Obtener estadísticas en paralelo con deduplicación
      const [aulasStats, usuariosStats] = await Promise.all([
        obtenerEstadisticasAulas(),
        obtenerEstadisticasUsuarios()
      ]);

      setStats({
        totalAulas: aulasStats?.total || 0,
        totalEstudiantes: usuariosStats?.total_alumnos || 0,
        totalDocentes: usuariosStats?.total_docentes || 0,
        loading: false
      });

      console.log("📊 Estadísticas de aulas cargadas:", {
        aulas: aulasStats?.total,
        estudiantes: usuariosStats?.total_alumnos,
        docentes: usuariosStats?.total_docentes
      });
    } catch (error) {
      console.error("❌ Error cargando estadísticas de aulas:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleCreateAula = () => {
    setOpenCreateModal(true);
  };

  const handleViewAula = (aulaId) => {
    setSelectedAulaId(aulaId);
    setOpenViewModal(true);
  };

  const handleEditAula = (aulaId) => {
    setSelectedAulaId(aulaId);
    setOpenEditModal(true);
  };

  const handleAulaCreated = (nuevaAula) => {
    console.log("Aula creada:", nuevaAula);
    setNewAulaData(nuevaAula);
    setOpenCreateModal(false);
    setOpenConfigureModal(true);
  };

  const handleAulaConfigured = (configData) => {
    console.log("Aula configurada:", configData);
    setOpenConfigureModal(false);
    setNewAulaData(null);
    fetchAulas(); // Recargar la lista
    fetchStats(); // Recargar estadísticas
  };

  const handleAulaUpdated = (aulaEditada) => {
    console.log("Aula editada:", aulaEditada);
    fetchAulas(); // Recargar la lista
    fetchStats(); // Recargar estadísticas
  };


  return (
    <>
      <h1 className="admin-page-title admin-aulas-title">🏫 Gestión de Aulas</h1>
      
      <AdminActionsBar 
        btnTitle={"Nueva Aula"} 
        btnClassName="btnAdd" 
        btnStyle={gradients.purpleGradient}
        onBtnClick={handleCreateAula}
      />


      <div className="admin-page-container admin-aulas-container">
        {/* Estadísticas de aulas */}
        <div className="stats-grid">
          <CardStats 
            icon={<FaGraduationCap color="#8b5cf6"/>} 
            number={stats.loading ? "..." : stats.totalAulas.toString()} 
            label={"Total Aulas"}
          />
          <CardStats 
            icon={<FaUsers color="#8b5cf6"/>} 
            number={stats.loading ? "..." : stats.totalEstudiantes.toString()} 
            label={"Total Estudiantes"}
          />
          <CardStats 
            icon={<FaChalkboardTeacher color="#8b5cf6"/>} 
            number={stats.loading ? "..." : stats.totalDocentes.toString()} 
            label={"Total Docentes"}
          />
        </div>

        {/* Vista de tarjetas de aulas */}
        <div className="aulas-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando aulas...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error al cargar las aulas</h3>
              <p>{error}</p>
              <div className="error-details">
                <p><strong>Posible causa:</strong> El backend está intentando acceder a campos que no existen en la tabla docente.</p>
                <p><strong>Solución:</strong> El backend necesita corregir la consulta SQL en <code>src/services/aula.service.js</code> línea 96.</p>
                <p><strong>Detalles técnicos:</strong> <code>column docente_1.nombre does not exist</code></p>
              </div>
              <button className="btn-retry" onClick={fetchAulas}>
                Reintentar
              </button>
            </div>
          ) : aulas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏫</div>
              <h3>No hay aulas registradas</h3>
              <p>Crea tu primera aula para comenzar</p>
              <button className="btn-primary" onClick={handleCreateAula}>
                Crear Primera Aula
              </button>
            </div>
          ) : (
            <>
              {aulas.map((aula) => (
                <AulasCard 
                  key={aula.id_aula}
                  aula={aula}
                  onView={handleViewAula}
                  onEdit={handleEditAula}
                />
              ))}
              <CreateCard 
                title={"Crear Nueva Aula"} 
                text={"Configura un nuevo espacio de aprendizaje"} 
                btnText={"Crear Aula"} 
                theme="purple"
                onClick={handleCreateAula}
              />
            </>
          )}
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
                <th>Asignación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                    Cargando aulas...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#e53e3e'}}>
                    {error}
                  </td>
                </tr>
              ) : aulas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                    No hay aulas registradas
                  </td>
                </tr>
              ) : (
                aulas.map((aula) => {
                  // Calcular progreso basado en los datos disponibles
                  const calcularProgreso = () => {
                    let progreso = 0;
                    
                    // Docente asignado: 40%
                    if (aula.docente_id_docente) {
                      progreso += 40;
                    }
                    
                    // Estudiantes asignados: 30%
                    if (aula.total_estudiantes && aula.total_estudiantes > 0) {
                      progreso += 30;
                    }
                    
                    // Cuentos asignados: 30%
                    if (aula.total_cuentos && aula.total_cuentos > 0) {
                      progreso += 30;
                    }
                    
                    return Math.min(progreso, 100);
                  };
                  
                  const progreso = calcularProgreso();
                  
                  // Determinar clase CSS según porcentaje
                  const getProgressClass = () => {
                    if (progreso <= 30) return 'progress-low';
                    if (progreso <= 60) return 'progress-medium';
                    if (progreso <= 90) return 'progress-high';
                    return 'progress-complete';
                  };
                  
                  return (
                    <tr key={aula.id_aula}>
                      <td>
                        <div className="aula-info">
                          <div className="aula-icon">🏫</div>
                          <div>
                            <div className="aula-name">{aula.nombre_aula || "Sin nombre"}</div>
                            <div className="aula-code">{aula.codigo_acceso || `AULA-${aula.id_aula}`}</div>
                          </div>
                        </div>
                      </td>
                      <td>{aula.grado || "Sin grado"}</td>
                      <td>
                        {aula.docente_id_docente ? 
                          `${aula.docente?.nombre || 'Docente'} ${aula.docente?.apellido || ''}` : 
                          "Sin asignar"
                        }
                      </td>
                      <td>{aula.total_estudiantes || 0}</td>
                      <td>
                        <div className={`mini-progress ${getProgressClass()}`}>
                          <div className="mini-progress-bar">
                            <div 
                              className={`mini-progress-fill ${getProgressClass()}`}
                              style={{width: `${progreso}%`}}
                            ></div>
                          </div>
                          <span>{progreso}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${aula.docente_id_docente ? 'status-assigned' : 'status-unassigned'}`}>
                          {aula.docente_id_docente ? 'Con Docente' : 'Sin Docente'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action btn-view" 
                            title="Ver"
                            onClick={() => handleViewAula(aula.id_aula)}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-action btn-edit" 
                            title="Editar"
                            onClick={() => handleEditAula(aula.id_aula)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <CreateAulaModal 
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onAulaCreated={handleAulaCreated}
      />

      <ConfigureAulaModal 
        isOpen={openConfigureModal}
        onClose={() => {
          setOpenConfigureModal(false);
          setNewAulaData(null);
        }}
        aulaId={newAulaData?.id_aula}
        onConfigured={handleAulaConfigured}
      />

      <ViewAulaModal 
        isOpen={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedAulaId(null);
        }}
        aulaId={selectedAulaId}
      />

      <EditAulaModal 
        isOpen={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setSelectedAulaId(null);
        }}
        aulaId={selectedAulaId}
        onUpdated={handleAulaUpdated}
      />
    </>
  );
}


