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
      <div id="view-aula-modal-unique" className="modal-content view-aula-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏫 Detalles del Aula</h2>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ✕
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
              {/* Información General */}
              <div className="info-section">
                <h3>📋 Información General</h3>
                <div className="info-grid aula-modal-info-grid">
                  <div className="info-item">
                    <label>Nombre:</label>
                    <span>{aula.nombre_aula || "No especificado"}</span>
                  </div>
                  <div className="info-item">
                    <label>Grado:</label>
                    <span>{aula.grado || "No especificado"}</span>
                  </div>
                  <div className="info-item">
                    <label>Código de Acceso:</label>
                    <input type="text" value={aula.codigo_acceso || "No generado"} readOnly className="code-input" />
                  </div>
                  <div className="info-item">
                    <label>Docente Asignado:</label>
                    <input type="text" value={aula.docente ? `${aula.docente.usuario?.nombre || 'Docente'} ${aula.docente.usuario?.apellido || ''}` : "Sin asignar"} readOnly className="teacher-input" />
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="stats-section">
                <h3>📊 Estadísticas</h3>
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-number">{aula.docente ? 1 : 0}</div>
                    <div className="stat-label">Docente</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👨‍🎓</div>
                    <div className="stat-number">{aula.total_estudiantes || 0}</div>
                    <div className="stat-label">Estudiantes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-number">{aula.total_cuentos || 0}</div>
                    <div className="stat-label">Cuentos</div>
                  </div>
                </div>
              </div>

              {/* Estudiantes */}
              <div className="students-section">
                <h3>👨‍🎓 Estudiantes Asignados ({aula.total_estudiantes || 0})</h3>
                {aula.estudiantes && aula.estudiantes.length > 0 ? (
                  <div className="students-list">
                    {aula.estudiantes.map((estudiante, index) => (
                      <div key={estudiante.id || index} className="student-item">
                        <div className="student-icon">👨‍🎓</div>
                        <div className="student-info">
                          <div className="student-name">
                            {estudiante.usuario?.nombre || 'Sin nombre'} {estudiante.usuario?.apellido || 'Sin apellido'}
                          </div>
                          <div className="student-email">{estudiante.usuario?.email || 'Sin email'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-students">
                    <div className="empty-icon">👨‍🎓</div>
                    <p>No hay estudiantes asignados a este aula</p>
                  </div>
                )}
              </div>

              {/* Cuentos */}
              <div className="cuentos-section">
                <h3>📚 Cuentos Asignados ({aula.total_cuentos || 0})</h3>
                {aula.cuentos && aula.cuentos.length > 0 ? (
                  <div className="cuentos-list">
                    {aula.cuentos.map((cuento, index) => (
                      <div key={cuento.id || index} className="cuento-item">
                        <div className="cuento-icon">📚</div>
                        <div className="cuento-info">
                          <div className="cuento-title">{cuento.titulo}</div>
                          <div className="cuento-details">
                            Edad: {cuento.edad_publico} años | Autor: {cuento.autor?.nombre || 'Sin autor'} {cuento.autor?.apellido || ''} | Género: {cuento.genero?.nombre || 'Sin género'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-cuentos">
                    <div className="empty-icon">📚</div>
                    <p>No hay cuentos asignados a este aula</p>
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
