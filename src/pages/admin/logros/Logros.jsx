import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateLogroModal from "../../../components/Modals/CreateLogroModal/CreateLogroModal";
import LogrosTable from "../../../components/TableLogros/TableLogros";
import { gradients } from "../../../styles/Gradients";
import EditarLogroModal from "../../../components/Modals/EditLogros/EditLogroModal";
import "../AdminPages.css";
import "./Logros.css";
import { useNavigate } from 'react-router-dom';
import { obtenerLogros, eliminarLogro } from '../../../api/logros';
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
  const [eliminando, setEliminando] = useState(null);

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
    
    const response = await obtenerLogros();
    
    if (response.ok) {
      const logrosData = response.logros || [];
      setLogros(logrosData);
      
      if (logrosData.length === 0) {
        setError('No hay logros creados aún. ¡Crea tu primer logro!');
      }
    } else {
      setError(`Error al cargar los logros: ${response.error || 'Error desconocido'}`);
      setLogros([]);
    }
  } catch (error) {
    console.error('Error cargando logros:', error);
    setError(`Error al cargar los logros: ${error.message || 'Error de conexión'}`);
    setLogros([]);
  } finally {
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

 const handleDeleteLogro = async (logroId) => {
    
    const logro = logros.find(l => l.id_logros === logroId);
    
    if (!logro) {
      console.error('Logro no encontrado');
      return;
    }

    
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el logro "${logro.nombre}"?\n\n` +
      `Esta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;
    
    try {
      setEliminando(logroId); 
      
      const resultado = await eliminarLogro(logroId);
      
      if (resultado.ok) {
      
       alert('Logro eliminado exitosamente');
        
    
        setLogros(logros.filter(l => l.id_logros !== logroId));
      } else {
        
        if (resultado.error.includes('alumnos que ya lo han desbloqueado')) {
          
              alert('No se puede eliminar este logro porque hay estudiantes que ya lo tienen');

        } else {
          alert(resultado.error);
        }
      }
    } catch (error) {
      alert('Error al eliminar el logro');
      console.error(error);
    } finally {
      setEliminando(null);
    }
  };


  
    const handleViewLogro = (logroId) => {
  navigate(`/admin/logros/${logroId}`);
};


  const estadisticas = {
    total: logros.length,
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