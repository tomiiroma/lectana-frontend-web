import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaBook, FaUser, FaUsers, FaClipboardList, FaEdit, FaTrash, FaClock, FaCheckCircle } from 'react-icons/fa';
import { obtenerActividadPorId, eliminarActividad } from '../../../api/actividades';
import './ViewActividadModal.css';

const ViewActividadModal = ({ isOpen, onClose, actividadId, onEdit, onDelete }) => {
  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && actividadId) {
      cargarActividad();
    }
  }, [isOpen, actividadId]);

  const cargarActividad = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerActividadPorId(actividadId);
      setActividad(response.actividad);
    } catch (error) {
      console.error('Error cargando actividad:', error);
      
      // Mensaje de error más específico
      let errorMessage = 'Error al cargar los detalles de la actividad';
      
      if (error.message) {
        if (error.message.includes('Error de base de datos')) {
          errorMessage = `Error del backend: ${error.message}. Este es un problema en la consulta SQL del servidor, no del frontend.`;
        } else if (error.message.includes('No se encontró')) {
          errorMessage = error.message;
        } else if (error.message.includes('conexión')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      } else if (error.error) {
        errorMessage = `Error: ${error.error}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    try {
      await eliminarActividad(actividadId);
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      setError('Error al eliminar la actividad');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No asignada';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoText = (tipo) => {
    switch (tipo) {
      case 'multiple_choice':
        return 'Opción Múltiple';
      case 'respuesta_abierta':
        return 'Respuesta Abierta';
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'multiple_choice':
        return '#3b82f6';
      case 'respuesta_abierta':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container view-actividad-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <FaClipboardList className="modal-icon" />
            Detalles de la Actividad
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando detalles de la actividad...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            {error.includes('Error de base de datos') || error.includes('column') ? (
              <div className="error-details" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', fontSize: '0.9rem' }}>
                <p><strong>⚠️ Este es un error del BACKEND:</strong></p>
                <p>El backend está intentando acceder a una columna de la base de datos que no existe.</p>
                <p><strong>Acción requerida:</strong> Revisar y corregir la consulta SQL en el controlador de actividades del backend.</p>
                <p><strong>Detalles técnicos:</strong> La consulta está intentando acceder a <code>respuesta_actividad_2.respuesta</code> pero esa columna no existe en la base de datos.</p>
              </div>
            ) : null}
            <button className="btn-retry" onClick={cargarActividad} style={{ marginTop: '1rem' }}>
              Reintentar
            </button>
          </div>
        ) : actividad ? (
          <div className="modal-content">
            {/* Información Principal */}
            <div className="info-section">
              <div className="info-header">
                <div className="actividad-type" style={{ backgroundColor: getTipoColor(actividad.tipo) }}>
                  {getTipoText(actividad.tipo)}
                </div>
                <div className="actividad-id">ID: {actividad.id_actividad}</div>
              </div>
              
              <h3 className="actividad-title">{actividad.descripcion}</h3>
              
              <div className="actividad-dates">
                <div className="date-item">
                  <FaCalendarAlt className="date-icon" />
                  <div className="date-info">
                    <span className="date-label">Fecha de Publicación</span>
                    <span className="date-value">{formatDate(actividad.fecha_publicacion)}</span>
                  </div>
                </div>
                
                {actividad.fecha_entrega && (
                  <div className="date-item">
                    <FaClock className="date-icon" />
                    <div className="date-info">
                      <span className="date-label">Fecha de Entrega</span>
                      <span className="date-value">{formatDate(actividad.fecha_entrega)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Asignaciones */}
            <div className="assignments-section">
              <h4 className="section-title">Asignaciones</h4>
              
              <div className="assignment-grid">
                <div className="assignment-item">
                  <FaBook className="assignment-icon" />
                  <div className="assignment-info">
                    <span className="assignment-label">Cuento</span>
                    <span className="assignment-value">
                      {actividad.cuento ? actividad.cuento.titulo : 'Sin asignar'}
                    </span>
                  </div>
                </div>
                
                <div className="assignment-item">
                  <FaUser className="assignment-icon" />
                  <div className="assignment-info">
                    <span className="assignment-label">Docente</span>
                    <span className="assignment-value">
                      {actividad.docente 
                        ? `${actividad.docente.nombre} ${actividad.docente.apellido}`
                        : 'Sin asignar'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aulas Asignadas */}
            <div className="aulas-section">
              <h4 className="section-title">
                <FaUsers className="section-icon" />
                Aulas Asignadas ({actividad.actividad_aula?.length || 0})
              </h4>
              
              {actividad.actividad_aula && actividad.actividad_aula.length > 0 ? (
                <div className="aulas-grid">
                  {actividad.actividad_aula.map((item, index) => (
                    <div key={index} className="aula-item">
                      <div className="aula-icon">🏫</div>
                      <div className="aula-info">
                        <div className="aula-name">{item.aula.nombre}</div>
                        <div className="aula-date">
                          Asignada: {formatDate(item.fecha_asignacion)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-aulas">
                  <FaUsers className="no-aulas-icon" />
                  <p>No hay aulas asignadas a esta actividad</p>
                </div>
              )}
            </div>

            {/* Estadísticas */}
            <div className="stats-section">
              <h4 className="section-title">
                <FaCheckCircle className="section-icon" />
                Estadísticas
              </h4>
              
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{actividad.actividad_aula?.length || 0}</div>
                  <div className="stat-label">Aulas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {actividad.fecha_entrega ? 'Programada' : 'Sin límite'}
                  </div>
                  <div className="stat-label">Estado</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {actividad.cuento ? 'Con cuento' : 'Sin cuento'}
                  </div>
                  <div className="stat-label">Tipo</div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="actions-section">
              <div className="action-buttons">
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => onEdit(actividad.id_actividad)}
                >
                  <FaEdit className="btn-icon" />
                  Editar
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <FaTrash className="btn-icon" />
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ViewActividadModal;
