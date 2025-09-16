import { useState, useEffect } from "react";
import { obtenerAulaPorId } from "../../../api/aulas";
import "./ViewAulaModal.css";

function ViewAulaModal({ isOpen, onClose, aulaId }) {
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && aulaId) {
      fetchAulaData();
    }
  }, [isOpen, aulaId]);

  const fetchAulaData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(`Obteniendo datos del aula ${aulaId}...`);
      const aulaData = await obtenerAulaPorId(aulaId);
      console.log("Datos del aula obtenidos:", aulaData);
      console.log("Estructura de datos:", {
        tieneEstudiantes: !!aulaData.estudiantes,
        tieneCuentos: !!aulaData.cuentos,
        tieneDocente: !!aulaData.docente,
        totalEstudiantes: aulaData.total_estudiantes,
        totalCuentos: aulaData.total_cuentos,
        estudiantesCount: aulaData.estudiantes?.length || 0,
        cuentosCount: aulaData.cuentos?.length || 0
      });
      setAula(aulaData);
    } catch (error) {
      console.error("Error obteniendo datos del aula:", error);
      setError("Error al cargar los datos del aula");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAula(null);
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content view-aula-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏫 Detalles del Aula</h2>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando datos del aula...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="btn-retry" onClick={fetchAulaData}>
                Reintentar
              </button>
            </div>
          ) : aula ? (
            <div className="aula-details">
              {/* Información básica */}
              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Nombre:</label>
                    <span>{aula.nombre_aula || "No especificado"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Grado:</label>
                    <span>{aula.grado || "No especificado"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Código de Acceso:</label>
                    <span className="code-badge">{aula.codigo_acceso || "No generado"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Docente Asignado:</label>
                    <span className={`status-badge ${aula.docente ? 'status-assigned' : 'status-unassigned'}`}>
                      {aula.docente ? 
                        `${aula.docente.usuario?.nombre || 'Docente'} ${aula.docente.usuario?.apellido || ''}` : 
                        "Sin asignar"
                      }
                    </span>
                  </div>
                </div>
              </div>


              {/* Estadísticas */}
              <div className="detail-section">
                <h3>Estadísticas</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-content">
                      <div className="stat-number">{aula.docente ? 1 : 0}</div>
                      <div className="stat-label">Docente</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-content">
                      <div className="stat-number">{aula.total_estudiantes || 0}</div>
                      <div className="stat-label">Estudiantes</div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                      <div className="stat-number">{aula.total_cuentos || 0}</div>
                      <div className="stat-label">Cuentos</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de estudiantes */}
              <div className="detail-section">
                <h3>Estudiantes Asignados ({aula.total_estudiantes || 0})</h3>
                {aula.estudiantes && aula.estudiantes.length > 0 ? (
                  <div className="list-container">
                    {aula.estudiantes.slice(0, 10).map((estudiante, index) => (
                      <div key={estudiante.id || index} className="list-item">
                        <div className="item-icon">👨‍🎓</div>
                        <div className="item-content">
                          <div className="item-name">
                            {estudiante.usuario?.nombre || 'Sin nombre'} {estudiante.usuario?.apellido || 'Sin apellido'}
                          </div>
                          <div className="item-email">{estudiante.usuario?.email || 'Sin email'}</div>
                        </div>
                      </div>
                    ))}
                    {aula.estudiantes.length > 10 && (
                      <div className="more-items">
                        ... y {aula.estudiantes.length - 10} estudiantes más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">👨‍🎓</div>
                    <p>No hay estudiantes asignados a este aula</p>
                    <small>Usa "Editar" para asignar estudiantes</small>
                  </div>
                )}
              </div>

              {/* Lista de cuentos */}
              <div className="detail-section">
                <h3>Cuentos Asignados ({aula.total_cuentos || 0})</h3>
                {aula.cuentos && aula.cuentos.length > 0 ? (
                  <div className="list-container">
                    {aula.cuentos.slice(0, 10).map((cuento, index) => (
                      <div key={cuento.id || index} className="list-item">
                        <div className="item-icon">📚</div>
                        <div className="item-content">
                          <div className="item-name">{cuento.titulo}</div>
                          <div className="item-detail">
                            Edad: {cuento.edad_publico} años | Autor: {cuento.autor?.nombre || 'Sin autor'} {cuento.autor?.apellido || ''} | Género: {cuento.genero?.nombre || 'Sin género'}
                          </div>
                        </div>
                      </div>
                    ))}
                    {aula.cuentos.length > 10 && (
                      <div className="more-items">
                        ... y {aula.cuentos.length - 10} cuentos más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <p>No hay cuentos asignados a este aula</p>
                    <small>Usa "Editar" para asignar cuentos</small>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose} disabled={loading}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewAulaModal;
