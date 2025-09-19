import React from 'react';
import { FaEye, FaEdit, FaTrash, FaUsers, FaCalendarAlt, FaBook, FaUser, FaClipboardList, FaClock } from 'react-icons/fa';
import './ActividadCard.css';

const ActividadCard = ({ 
  actividad, 
  onView, 
  onEdit, 
  onDelete, 
  onManageAulas 
}) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (fechaEntrega) => {
    if (!fechaEntrega) return '#10b981'; // Sin límite - verde
    
    const now = new Date();
    const entrega = new Date(fechaEntrega);
    const diffDays = Math.ceil((entrega - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#ef4444'; // Vencida - rojo
    if (diffDays <= 3) return '#f59e0b'; // Próxima a vencer - amarillo
    return '#10b981'; // En tiempo - verde
  };

  const getStatusText = (fechaEntrega) => {
    if (!fechaEntrega) return 'Sin límite';
    
    const now = new Date();
    const entrega = new Date(fechaEntrega);
    const diffDays = Math.ceil((entrega - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `${diffDays} días restantes`;
  };

  const getProgressPercentage = (fechaEntrega) => {
    if (!fechaEntrega) return 100; // Sin límite = 100%
    
    const now = new Date();
    const entrega = new Date(fechaEntrega);
    const publicacion = new Date(actividad.fecha_publicacion);
    
    const totalDays = Math.ceil((entrega - publicacion) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now - publicacion) / (1000 * 60 * 60 * 24));
    
    if (totalDays <= 0) return 100;
    if (elapsedDays < 0) return 0;
    
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  };

  return (
    <div className="actividad-card">
      {/* Header con tipo y acciones */}
      <div className="actividad-header">
        <div 
          className="actividad-type"
          style={{ backgroundColor: getTipoColor(actividad.tipo) }}
        >
          {getTipoText(actividad.tipo)}
        </div>
        <div className="actividad-actions">
          <button 
            className="btn-action btn-view" 
            onClick={() => onView(actividad.id_actividad)}
            title="Ver detalles"
          >
            <FaEye />
          </button>
          <button 
            className="btn-action btn-edit" 
            onClick={() => onEdit(actividad.id_actividad)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button 
            className="btn-action btn-delete" 
            onClick={() => onDelete(actividad.id_actividad)}
            title="Eliminar"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Título y descripción */}
      <div className="actividad-content">
        <h3 className="actividad-title">
          {actividad.descripcion.length > 60 
            ? `${actividad.descripcion.substring(0, 60)}...` 
            : actividad.descripcion
          }
        </h3>
        
        <div className="actividad-meta">
          <div className="meta-item">
            <FaCalendarAlt className="meta-icon" />
            <span>Publicada: {formatDate(actividad.fecha_publicacion)}</span>
          </div>
          
          {actividad.fecha_entrega && (
            <div className="meta-item">
              <FaClock className="meta-icon" />
              <span>Entrega: {formatDate(actividad.fecha_entrega)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Asignaciones */}
      <div className="actividad-assignments">
        <div className="assignment-item">
          <FaBook className="assignment-icon" />
          <span className="assignment-text">
            {actividad.cuento ? actividad.cuento.titulo : 'Sin cuento'}
          </span>
        </div>
        
        <div className="assignment-item">
          <FaUser className="assignment-icon" />
          <span className="assignment-text">
            {actividad.docente 
              ? `${actividad.docente.nombre} ${actividad.docente.apellido}`
              : 'Sin docente'
            }
          </span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="actividad-stats">
        <div className="stat-item">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <div className="stat-value">{actividad.actividad_aula?.length || 0}</div>
            <div className="stat-label">Aulas</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(actividad.fecha_entrega) }}
          ></div>
          <div className="stat-info">
            <div className="stat-value">{getStatusText(actividad.fecha_entrega)}</div>
            <div className="stat-label">Estado</div>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {actividad.fecha_entrega && (
        <div className="actividad-progress">
          <div className="progress-label">
            <span>Progreso</span>
            <span>{Math.round(getProgressPercentage(actividad.fecha_entrega))}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${getProgressPercentage(actividad.fecha_entrega)}%`,
                backgroundColor: getStatusColor(actividad.fecha_entrega)
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Botón de gestión de aulas */}
      <div className="actividad-footer">
        <button 
          className="btn-manage-aulas"
          onClick={() => onManageAulas(actividad.id_actividad)}
        >
          <FaUsers className="btn-icon" />
          Gestionar Aulas ({actividad.actividad_aula?.length || 0})
        </button>
      </div>
    </div>
  );
};

export default ActividadCard;
