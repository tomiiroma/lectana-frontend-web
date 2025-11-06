import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import TiendaTable from "../../../components/TableTienda/TableTienda";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Tienda.css";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUsers, FaStar, FaCoins, FaPlus } from "react-icons/fa";

export default function Tienda() {
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const [avatares, setAvatares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAvatares, setFilteredAvatares] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarAvatares();
  }, []);

  useEffect(() => {
    filtrarAvatares();
  }, [avatares, searchTerm]);

  const cargarAvatares = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Reemplazar con tu API cuando esté lista
      // const response = await obtenerAvatares();
      
      // MOCK DATA - Datos de ejemplo
      const mockData = {
        ok: true,
        avatares: [
          {
            id_avatar: 1,
            nombre: 'Avatar Robot',
            descripcion: 'Avatar futurista con diseño robótico',
            precio: 3,
            url_imagen: 'https://i.pravatar.cc/150?img=1',
            comprados: 5
          },
          {
            id_avatar: 2,
            nombre: 'Avatar Gato',
            descripcion: 'Lindo avatar de gatito kawaii',
            precio: 5,
            url_imagen: 'https://i.pravatar.cc/150?img=2',
            comprados: 12
          },
          {
            id_avatar: 3,
            nombre: 'Avatar Espacial',
            descripcion: 'Avatar de astronauta en el espacio',
            precio: 9,
            url_imagen: 'https://i.pravatar.cc/150?img=3',
            comprados: 3
          }
        ]
      };
      
      if (mockData.ok) {
        const avataresData = mockData.avatares || [];
        setAvatares(avataresData);
        
        if (avataresData.length === 0) {
          setError('No hay avatares creados aún. ¡Crea tu primer avatar!');
        }
      } else {
        setError(`Error al cargar los avatares: ${mockData.error || 'Error desconocido'}`);
        setAvatares([]);
      }
    } catch (error) {
      console.error('Error cargando avatares:', error);
      setError(`Error al cargar los avatares: ${error.message || 'Error de conexión'}`);
      setAvatares([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarAvatares = () => {
    let filtrados = avatares;

    if (searchTerm) {
      filtrados = filtrados.filter(avatar => {
        const nombreMatch = avatar.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const descripcionMatch = avatar.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        return nombreMatch || descripcionMatch;
      });
    }

    setFilteredAvatares(filtrados);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCreateAvatar = () => {
    setShowCreateModal(true); 
  };

  const handleCloseModal = () => {
    setShowCreateModal(false); 
  };

  const handleModalSuccess = () => {
    console.log('Avatar creado exitosamente');
    cargarAvatares(); 
  };

  const handleEditAvatar = (avatarId) => {
    console.log('Editar avatar:', avatarId);
    setSelectedAvatarId(avatarId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAvatarId(null);
  };

  const handleEditSuccess = () => {
    console.log('Avatar editado exitosamente');
    cargarAvatares(); 
  };

  const handleDeleteAvatar = async (avatarId) => {
    const avatar = avatares.find(a => a.id_avatar === avatarId);
    
    if (!avatar) {
      console.error('Avatar no encontrado');
      return;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el avatar "${avatar.nombre}"?\n\n` +
      `Esta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;
    
    try {
      setEliminando(avatarId); 
      
      // TODO: Reemplazar con tu API cuando esté lista
      // const resultado = await eliminarAvatar(avatarId);
      
      // MOCK - Simula eliminación exitosa
      const resultado = { ok: true };
      
      if (resultado.ok) {
        alert('Avatar eliminado exitosamente');
        setAvatares(avatares.filter(a => a.id_avatar !== avatarId));
      } else {
        if (resultado.error.includes('alumnos que ya lo compraron')) {
          alert('No se puede eliminar este avatar porque hay estudiantes que ya lo compraron');
        } else {
          alert(resultado.error);
        }
      }
    } catch (error) {
      alert('Error inesperado al eliminar el avatar');
      console.error(error);
    } finally {
      setEliminando(null);
    }
  };

  const handleViewAvatar = (avatarId) => {
    navigate(`/admin/tienda/${avatarId}`);
  };

  // Calcular estadísticas
  const totalComprados = avatares.reduce((sum, a) => sum + (a.comprados || 0), 0);
  const masVendido = avatares.length > 0 
    ? avatares.reduce((max, a) => (a.comprados || 0) > (max.comprados || 0) ? a : max, avatares[0])
    : null;
  const promedioPrecio = avatares.length > 0
    ? Math.round(avatares.reduce((sum, a) => sum + a.precio, 0) / avatares.length)
    : 0;

  const estadisticas = {
    total: avatares.length,
    totalComprados: totalComprados,
    masVendido: masVendido ? masVendido.nombre : '-',
    promedioPrecio: promedioPrecio
  };

  return (
    <>
      <h1 className="admin-page-title admin-tienda-title">🛍️ Gestión de Tienda</h1>
      
      <AdminActionsBar 
        btnTitle="Nuevo Avatar" 
        placeholderTitle="Buscar Avatar..." 
        btnClassName="btnAdd" 
        btnStyle={gradients.purpleGradient}
        onSearch={handleSearch}
        onBtnClick={handleCreateAvatar}
      />

      <div className="admin-page-container admin-tienda-container">
        <div className="stats-grid">
          <CardStats 
            icon={<FaShoppingCart color="#9c27b0"/>} 
            number={estadisticas.total} 
            label="Total Avatares"
          />
          <CardStats 
            icon={<FaUsers color="#9c27b0"/>} 
            number={estadisticas.totalComprados} 
            label="Total Comprados"
          />
          <CardStats 
            icon={<FaStar color="#9c27b0"/>} 
            number={estadisticas.masVendido} 
            label="Más Vendido"
          />
          <CardStats 
            icon={<FaCoins color="#9c27b0"/>} 
            number={`${estadisticas.promedioPrecio} pts`} 
            label="Precio Promedio"
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando avatares...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn-retry" onClick={cargarAvatares}>
                Reintentar
              </button>
              <button className="btn-primary" onClick={handleCreateAvatar}>
                <FaPlus className="btn-icon" />
                Crear Avatar de Todas Formas
              </button>
            </div>
          </div>
        ) : (
          <>
            <TiendaTable 
              avatares={filteredAvatares}
              onEdit={handleEditAvatar}
              onDelete={handleDeleteAvatar}
              onView={handleViewAvatar}
            />

            {filteredAvatares.length === 0 && !loading && (
              <div className="no-results">
                <FaShoppingCart className="no-results-icon" />
                <h3>No se encontraron avatares</h3>
                <p>
                  {searchTerm 
                    ? `No hay avatares que coincidan con "${searchTerm}"`
                    : 'No hay avatares disponibles'
                  }
                </p>
                {!searchTerm && (
                  <button className="btn-primary" onClick={handleCreateAvatar}>
                    <FaPlus className="btn-icon" />
                    Crear Primer Avatar
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* TODO: Agregar modales de Crear y Editar Avatar cuando estén listos */}
      {/* <CreateAvatarModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />

      <EditarAvatarModal
        estaAbierto={showEditModal}
        alCerrar={handleCloseEditModal}
        alActualizar={handleEditSuccess}
        avatarId={selectedAvatarId}
      /> */}
    </>
  );
}