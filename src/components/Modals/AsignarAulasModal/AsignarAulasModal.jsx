import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaUsers, FaCheck, FaTrash } from 'react-icons/fa';
import { obtenerAulasActividad, asignarActividadAulas, removerActividadDeAula } from '../../../api/actividades';
import { listarAulas } from '../../../api/aulas';
import './AsignarAulasModal.css';

const AsignarAulasModal = ({ isOpen, onClose, actividadId, onSuccess }) => {
  const [aulasDisponibles, setAulasDisponibles] = useState([]);
  const [aulasAsignadas, setAulasAsignadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && actividadId) {
      cargarDatos();
    }
  }, [isOpen, actividadId]);

  const cargarDatos = async () => {
    setLoadingData(true);
    setError(null);
    try {
      const [aulasData, aulasActividadData] = await Promise.all([
        listarAulas(),
        obtenerAulasActividad(actividadId)
      ]);

      const todasLasAulas = aulasData || []; // listarAulas() retorna directamente el array
      const aulasAsignadasIds = (aulasActividadData.asignaciones || []).map(item => item.aula_id_aula);
      
      setAulasAsignadas(aulasActividadData.asignaciones || []);
      setAulasDisponibles(todasLasAulas.filter(aula => !aulasAsignadasIds.includes(aula.id_aula)));
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos de las aulas');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAsignarAula = async (aulaId) => {
    setLoading(true);
    try {
      const nuevasAulas = [...aulasAsignadas.map(item => item.aula_id_aula), aulaId];
      await asignarActividadAulas(actividadId, nuevasAulas);
      
      // Actualizar estado local
      const aula = aulasDisponibles.find(a => a.id_aula === aulaId);
      setAulasAsignadas(prev => [...prev, {
        aula_id_aula: aulaId,
        aula: aula,
        fecha_asignacion: new Date().toISOString()
      }]);
      setAulasDisponibles(prev => prev.filter(a => a.id_aula !== aulaId));
      
      onSuccess();
    } catch (error) {
      console.error('Error asignando aula:', error);
      setError('Error al asignar el aula');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverAula = async (aulaId) => {
    if (!window.confirm('¿Estás seguro de que quieres remover esta aula de la actividad?')) {
      return;
    }

    setLoading(true);
    try {
      await removerActividadDeAula(actividadId, aulaId);
      
      // Actualizar estado local
      const aula = aulasAsignadas.find(item => item.aula_id_aula === aulaId);
      setAulasDisponibles(prev => [...prev, aula.aula]);
      setAulasAsignadas(prev => prev.filter(item => item.aula_id_aula !== aulaId));
      
      onSuccess();
    } catch (error) {
      console.error('Error removiendo aula:', error);
      setError('Error al remover el aula');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container asignar-aulas-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <FaUsers className="modal-icon" />
            Gestionar Aulas de la Actividad
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {loadingData ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando aulas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={cargarDatos}>
              Reintentar
            </button>
          </div>
        ) : (
          <div className="modal-content">
            {/* Aulas Asignadas */}
            <div className="aulas-section">
              <h3 className="section-title">
                <FaCheck className="section-icon" />
                Aulas Asignadas ({aulasAsignadas.length})
              </h3>
              
              {aulasAsignadas.length > 0 ? (
                <div className="aulas-grid">
                  {aulasAsignadas.map((item, index) => (
                    <div key={index} className="aula-item assigned">
                      <div className="aula-info">
                        <div className="aula-name">{item.aula.nombre}</div>
                        <div className="aula-details">
                          <FaUsers className="aula-icon" />
                          {item.aula.capacidad || 'N/A'} estudiantes
                        </div>
                        <div className="aula-date">
                          Asignada: {formatDate(item.fecha_asignacion)}
                        </div>
                      </div>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoverAula(item.aula_id_aula)}
                        disabled={loading}
                        title="Remover aula"
                      >
                        <FaTrash />
                      </button>
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

            {/* Aulas Disponibles */}
            <div className="aulas-section">
              <h3 className="section-title">
                <FaPlus className="section-icon" />
                Aulas Disponibles ({aulasDisponibles.length})
              </h3>
              
              {aulasDisponibles.length > 0 ? (
                <div className="aulas-grid">
                  {aulasDisponibles.map(aula => (
                    <div key={aula.id_aula} className="aula-item available">
                      <div className="aula-info">
                        <div className="aula-name">{aula.nombre}</div>
                        <div className="aula-details">
                          <FaUsers className="aula-icon" />
                          {aula.capacidad || 'N/A'} estudiantes
                        </div>
                      </div>
                      <button
                        className="btn-assign"
                        onClick={() => handleAsignarAula(aula.id_aula)}
                        disabled={loading}
                        title="Asignar aula"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-aulas">
                  <FaCheck className="no-aulas-icon" />
                  <p>Todas las aulas están asignadas a esta actividad</p>
                </div>
              )}
            </div>

            {/* Resumen */}
            <div className="summary-section">
              <div className="summary-stats">
                <div className="stat-item">
                  <div className="stat-value">{aulasAsignadas.length}</div>
                  <div className="stat-label">Aulas Asignadas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{aulasDisponibles.length}</div>
                  <div className="stat-label">Aulas Disponibles</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {aulasAsignadas.reduce((total, item) => total + (item.aula.capacidad || 0), 0)}
                  </div>
                  <div className="stat-label">Total Estudiantes</div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignarAulasModal;
