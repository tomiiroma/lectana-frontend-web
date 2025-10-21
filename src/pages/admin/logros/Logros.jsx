import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateLogroModal from "../../../components/Modals/CreateLogroModal/CreateLogroModal";
import LogrosTable from "../../../components/TableLogros/TableLogros";
import { gradients } from "../../../styles/Gradients";
import EditarLogroModal from "../../../components/Modals/EditLogros/EditLogroModal";
import "../AdminPages.css";
import "./Logros.css";
import { useNavigate } from 'react-router-dom'
import { FaTrophy, FaUsers, FaStar, FaAward, FaPlus } from "react-icons/fa";

export default function Logros() {
  
const [showEditModal, setShowEditModal] = useState(false);
const [selectedLogroId, setSelectedLogroId] = useState(null);

  const [logros, setLogros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLogros, setFilteredLogros] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    cargarLogros();
  }, []);

  useEffect(() => {
    filtrarLogros();
  }, [logros, searchTerm]);

  const cargarLogros = async () => {
    setLoading(true);
    setError(null);
    try {
      const logrosMock = [
        {
          id_logros: 1,
          nombre: 'Primer Libro Leído',
          descripcion: 'Completa tu primera lectura en la plataforma',
          url_imagen: 'https://via.placeholder.com/50/4CAF50/FFFFFF?text=📚',
          desbloqueados: 45
        },
        {
          id_logros: 2,
          nombre: 'Lector Entusiasta',
          descripcion: 'Lee 5 libros en un mes',
          url_imagen: 'https://via.placeholder.com/50/2196F3/FFFFFF?text=⭐',
          desbloqueados: 28
        },
        {
          id_logros: 3,
          nombre: 'Maestro de la Velocidad',
          descripcion: 'Completa un libro en menos de 3 días',
          url_imagen: 'https://via.placeholder.com/50/FF9800/FFFFFF?text=⚡',
          desbloqueados: 12
        },
        {
          id_logros: 4,
          nombre: 'Explorador de Géneros',
          descripcion: 'Lee libros de 5 categorías diferentes',
          url_imagen: 'https://via.placeholder.com/50/9C27B0/FFFFFF?text=🎭',
          desbloqueados: 33
        },
        {
          id_logros: 5,
          nombre: 'Coleccionista',
          descripcion: 'Desbloquea 10 logros diferentes',
          url_imagen: 'https://via.placeholder.com/50/F44336/FFFFFF?text=🏆',
          desbloqueados: 8
        }
      ];

      setTimeout(() => {
        setLogros(logrosMock);
        setLoading(false);
      }, 500);

    } catch (error) {
      console.error('Error cargando logros:', error);
      setError(`Error al cargar los logros: ${error.message || 'Error de conexión'}`);
      setLogros([]);
      setLoading(false);
    }
  };

  const filtrarLogros = () => {
    let filtrados = logros;

    if (searchTerm) {
      filtrados = filtrados.filter(logro => {
        const nombreMatch = logro.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const descripcionMatch = logro.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        return nombreMatch || descripcionMatch;
      });
    }

    setFilteredLogros(filtrados);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

 
  const handleCreateLogro = () => {
    setShowCreateModal(true); 
  };

 
  const handleCloseModal = () => {
    setShowCreateModal(false); 
  };

  const handleModalSuccess = () => {
    console.log('Logro creado exitosamente');
    cargarLogros(); 
  };

  const handleEditLogro = (logroId) => {
  console.log('Editar logro:', logroId);
  setSelectedLogroId(logroId);
  setShowEditModal(true);
};

const handleCloseEditModal = () => {
  setShowEditModal(false);
  setSelectedLogroId(null);
};

const handleEditSuccess = () => {
  console.log('Logro editado exitosamente');
  cargarLogros(); 
};

  const handleDeleteLogro = (logroId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este logro?')) {
      return;
    }
    console.log('Eliminar logro:', logroId);
  };


  
    const handleViewLogro = (logroId) => {
  navigate(`/admin/logros/${logroId}`);
};


  const estadisticas = {
    total: logros.length,
    totalDesbloqueados: logros.reduce((sum, logro) => sum + logro.desbloqueados, 0),
    masPopular: logros.length > 0 
      ? Math.max(...logros.map(l => l.desbloqueados)) 
      : 0,
    promedioDesbloqueados: logros.length > 0 
      ? Math.round(logros.reduce((sum, logro) => sum + logro.desbloqueados, 0) / logros.length)
      : 0
  };

  return (
    <>
      <h1 className="admin-page-title admin-logros-title">🏆 Gestión de Logros</h1>
      
      <AdminActionsBar 
        btnTitle="Nuevo Logro" 
        placeholderTitle="Buscar Logro..." 
        btnClassName="btnAdd" 
        btnStyle={gradients.purpleGradient}
        onSearch={handleSearch}
        onBtnClick={handleCreateLogro}
      />

      <div className="admin-page-container admin-logros-container">
        <div className="stats-grid">
          <CardStats 
            icon={<FaTrophy color="#9c27b0"/>} 
            number={estadisticas.total} 
            label="Total Logros"
          />
          <CardStats 
            icon={<FaUsers color="#9c27b0"/>} 
            number={estadisticas.totalDesbloqueados} 
            label="Total Desbloqueados"
          />
          <CardStats 
            icon={<FaStar color="#9c27b0"/>} 
            number={estadisticas.masPopular} 
            label="Más Popular"
          />
          <CardStats 
            icon={<FaAward color="#9c27b0"/>} 
            number={estadisticas.promedioDesbloqueados} 
            label="Promedio por Logro"
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando logros...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn-retry" onClick={cargarLogros}>
                Reintentar
              </button>
              <button className="btn-primary" onClick={handleCreateLogro}>
                <FaPlus className="btn-icon" />
                Crear Logro de Todas Formas
              </button>
            </div>
          </div>
        ) : (
          <>
            <LogrosTable 
              logros={filteredLogros}
              onEdit={handleEditLogro}
              onDelete={handleDeleteLogro}
              onView={handleViewLogro}
            />

            {filteredLogros.length === 0 && !loading && (
              <div className="no-results">
                <FaTrophy className="no-results-icon" />
                <h3>No se encontraron logros</h3>
                <p>
                  {searchTerm 
                    ? `No hay logros que coincidan con "${searchTerm}"`
                    : 'No hay logros disponibles'
                  }
                </p>
                {!searchTerm && (
                  <button className="btn-primary" onClick={handleCreateLogro}>
                    <FaPlus className="btn-icon" />
                    Crear Primer Logro
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <CreateLogroModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />

      <EditarLogroModal
          estaAbierto={showEditModal}
          alCerrar={handleCloseEditModal}
          alActualizar={handleEditSuccess}
          logroId={selectedLogroId}
      />


    </>
  );
}