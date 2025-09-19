import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import ActividadCard from "../../../components/Cards/ActividadCard/ActividadCard";
import CreateActividadWizard from "../../../components/Modals/CreateActividadWizard/CreateActividadWizard";
import EditActividadModal from "../../../components/Modals/EditActividadModal/EditActividadModal";
import ViewActividadModal from "../../../components/Modals/ViewActividadModal/ViewActividadModal";
import AsignarAulasModal from "../../../components/Modals/AsignarAulasModal/AsignarAulasModal";
import { gradients } from "../../../styles/Gradients";
import { statusStyles } from "../../../styles/statusStyle";
import { obtenerActividades, eliminarActividad } from "../../../api/actividades";
import "../AdminPages.css";
import "./Actividades.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaClipboardList, FaQuestionCircle, FaCheckCircle, FaClock, FaUsers, FaChartBar, FaBook, FaUser } from "react-icons/fa";

export default function Actividades() {
  // Estados principales
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todas');
  const [filteredActividades, setFilteredActividades] = useState([]);
  
  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAulasModal, setShowAulasModal] = useState(false);
  const [selectedActividadId, setSelectedActividadId] = useState(null);

  // Cargar actividades al montar el componente
  useEffect(() => {
    cargarActividades();
  }, []);

  // Filtrar actividades cuando cambien los filtros o búsqueda
  useEffect(() => {
    filtrarActividades();
  }, [actividades, searchTerm, activeFilter]);

  const cargarActividades = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerActividades();
      if (response.ok) {
        const actividadesData = response.actividades || [];
        setActividades(actividadesData);
        
        // Si no hay actividades, mostrar mensaje informativo
        if (actividadesData.length === 0) {
          setError('No hay actividades creadas aún. ¡Crea tu primera actividad!');
        }
      } else {
        // Si es error de backend, mostrar mensaje específico pero permitir crear actividades
        if (response.error && response.error.includes('column')) {
          setError(`Error del backend: ${response.error}. Puedes crear nuevas actividades pero no se pueden cargar las existentes.`);
        } else {
          setError(`Error al cargar las actividades: ${response.error || 'Error desconocido'}`);
        }
        setActividades([]);
      }
    } catch (error) {
      console.error('Error cargando actividades:', error);
      
      // Distinguir entre diferentes tipos de errores
      if (error.message && error.message.includes('Network Error')) {
        setError('Error de conexión con el servidor. Verifica que el backend esté funcionando.');
      } else if (error.message && error.message.includes('500')) {
        setError('Error del servidor. Posiblemente no hay actividades creadas o hay un problema con la base de datos.');
      } else {
        setError(`Error al cargar las actividades: ${error.message || 'Error de conexión'}`);
      }
      
      // Inicializar con array vacío para que la UI funcione
      setActividades([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarActividades = () => {
    let filtradas = actividades;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtradas = filtradas.filter(actividad =>
        actividad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (actividad.cuento?.titulo && actividad.cuento.titulo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actividad.docente && `${actividad.docente.nombre} ${actividad.docente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por tipo
    if (activeFilter !== 'todas') {
      filtradas = filtradas.filter(actividad => actividad.tipo === activeFilter);
    }

    setFilteredActividades(filtradas);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleCreateActividad = () => {
    setShowCreateModal(true);
  };

  const handleEditActividad = (actividadId) => {
    setSelectedActividadId(actividadId);
    setShowEditModal(true);
  };

  const handleViewActividad = (actividadId) => {
    setSelectedActividadId(actividadId);
    setShowViewModal(true);
  };

  const handleDeleteActividad = async (actividadId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await eliminarActividad(actividadId);
      await cargarActividades(); // Recargar la lista
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      alert('Error al eliminar la actividad');
    }
  };

  const handleManageAulas = (actividadId) => {
    setSelectedActividadId(actividadId);
    setShowAulasModal(true);
  };

  const handleModalSuccess = () => {
    cargarActividades(); // Recargar actividades después de cualquier cambio
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowAulasModal(false);
    setSelectedActividadId(null);
  };

  // Calcular estadísticas
  const estadisticas = {
    total: actividades.length,
    conCuento: actividades.filter(a => a.cuento_id_cuento).length,
    conDocente: actividades.filter(a => a.docente_id_docente).length,
    conAulas: actividades.filter(a => a.actividad_aula && a.actividad_aula.length > 0).length
  };

  const getFilterButtons = () => [
    { key: 'todas', label: 'Todas' },
    { key: 'multiple_choice', label: 'Opción Múltiple' },
    { key: 'respuesta_abierta', label: 'Respuesta Abierta' }
  ];

  return (
    <>
      <h1 className="admin-page-title admin-actividades-title">🎯 Gestión de Actividades</h1>
      
      <AdminActionsBar 
        btnTitle={"Nueva Actividad"} 
        placeholderTitle={"Buscar Actividad..."} 
        btnClassName="btnAdd" 
        btnStyle={gradients.redGradient}
        onSearch={handleSearch}
        onBtnClick={handleCreateActividad}
      />

      <div className="admin-page-container admin-actividades-container">
        {/* Estadísticas de actividades */}
        <div className="stats-grid">
          <CardStats 
            icon={<FaClipboardList color="#ef4444"/>} 
            number={estadisticas.total} 
            label={"Total Actividades"}
          />
          <CardStats 
            icon={<FaBook color="#ef4444"/>} 
            number={estadisticas.conCuento} 
            label={"Con Cuento"}
          />
          <CardStats 
            icon={<FaUser color="#ef4444"/>} 
            number={estadisticas.conDocente} 
            label={"Con Docente"}
          />
          <CardStats 
            icon={<FaUsers color="#ef4444"/>} 
            number={estadisticas.conAulas} 
            label={"Con Aulas"}
          />
        </div>

        {/* Filtros por tipo */}
        <div className="activity-filters">
          {getFilterButtons().map(filter => (
            <button 
              key={filter.key}
              className={`activity-filter ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando actividades...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">
              {error.includes('No hay actividades') ? '📝' : '⚠️'}
            </div>
            <p className="error-message">{error}</p>
            
            {error.includes('No hay actividades') ? (
              <div className="no-activities-info">
                <p className="info-text">
                  <strong>¡Perfecto!</strong> Es normal que no haya actividades al inicio. 
                  Puedes crear tu primera actividad usando el botón de abajo.
                </p>
                <div className="error-actions">
                  <button className="btn-primary" onClick={handleCreateActividad}>
                    <FaPlus className="btn-icon" />
                    Crear Primera Actividad
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="error-details">
                  <strong>Nota:</strong> Este error parece ser del backend. Verifica que la base de datos tenga la estructura correcta.
                </p>
                <div className="error-actions">
                  <button className="btn-retry" onClick={cargarActividades}>
                    Reintentar
                  </button>
                  <button className="btn-primary" onClick={handleCreateActividad}>
                    <FaPlus className="btn-icon" />
                    Crear Actividad de Todas Formas
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Grid de actividades */}
            <div className="actividades-grid">
              {filteredActividades.map(actividad => (
                <ActividadCard
                  key={actividad.id_actividad}
                  actividad={actividad}
                  onView={handleViewActividad}
                  onEdit={handleEditActividad}
                  onDelete={handleDeleteActividad}
                  onManageAulas={handleManageAulas}
                />
              ))}
              
              <CreateCard 
                title={"Crear Nueva Actividad"} 
                text={"Diseña una nueva actividad educativa personalizada"} 
                btnText={"Crear Actividad"} 
                theme="red"
                onClick={handleCreateActividad}
              />
            </div>

            {/* Tabla de rendimiento */}
            {filteredActividades.length > 0 && (
              <div className="table-container" style={{marginTop: '32px'}}>
                <h3 style={{marginBottom: '16px', color: '#ef4444', fontWeight: '600'}}>
                  Rendimiento por Actividad ({filteredActividades.length})
                </h3>
                <table className="admin-table actividades-table">
                  <thead>
                    <tr>
                      <th>Actividad</th>
                      <th>Tipo</th>
                      <th>Aulas</th>
                      <th>Cuento</th>
                      <th>Docente</th>
                      <th>Fecha Entrega</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActividades.map(actividad => (
                      <tr key={actividad.id_actividad}>
                        <td>
                          <div className="actividad-info">
                            <div className="actividad-icon">📖</div>
                            <div>
                              <div className="actividad-name">
                                {actividad.descripcion.length > 40 
                                  ? `${actividad.descripcion.substring(0, 40)}...` 
                                  : actividad.descripcion
                                }
                              </div>
                              <div className="actividad-code">ID: {actividad.id_actividad}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge type-${actividad.tipo}`}>
                            {actividad.tipo === 'multiple_choice' ? 'Opción Múltiple' : 'Respuesta Abierta'}
                          </span>
                        </td>
                        <td>{actividad.actividad_aula?.length || 0}</td>
                        <td>{actividad.cuento?.titulo || 'Sin asignar'}</td>
                        <td>
                          {actividad.docente 
                            ? `${actividad.docente.nombre} ${actividad.docente.apellido}`
                            : 'Sin asignar'
                          }
                        </td>
                        <td>
                          {actividad.fecha_entrega 
                            ? new Date(actividad.fecha_entrega).toLocaleDateString('es-ES')
                            : 'Sin límite'
                          }
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-action btn-view" 
                              title="Ver"
                              onClick={() => handleViewActividad(actividad.id_actividad)}
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="btn-action btn-edit" 
                              title="Editar"
                              onClick={() => handleEditActividad(actividad.id_actividad)}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredActividades.length === 0 && !loading && (
              <div className="no-results">
                <FaClipboardList className="no-results-icon" />
                <h3>No se encontraron actividades</h3>
                <p>
                  {searchTerm 
                    ? `No hay actividades que coincidan con "${searchTerm}"`
                    : 'No hay actividades disponibles'
                  }
                </p>
                {!searchTerm && (
                  <button className="btn-primary" onClick={handleCreateActividad}>
                    <FaPlus className="btn-icon" />
                    Crear Primera Actividad
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <CreateActividadWizard
        isOpen={showCreateModal}
        onClose={closeModals}
        onSuccess={handleModalSuccess}
      />

      <EditActividadModal
        isOpen={showEditModal}
        onClose={closeModals}
        actividadId={selectedActividadId}
        onSuccess={handleModalSuccess}
      />

      <ViewActividadModal
        isOpen={showViewModal}
        onClose={closeModals}
        actividadId={selectedActividadId}
        onEdit={handleEditActividad}
        onDelete={handleDeleteActividad}
      />

      <AsignarAulasModal
        isOpen={showAulasModal}
        onClose={closeModals}
        actividadId={selectedActividadId}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}


