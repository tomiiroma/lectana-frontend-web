import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import TiendaTable from "../../../components/TableTienda/TableTienda";
import CreateItemModal from "../../../components/Modals/CreateItemModal/CreateItemModal";
import EditarItemModal from "../../../components/Modals/EditItemModal/EditItemModal";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Tienda.css";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUsers, FaStar, FaCoins, FaPlus } from "react-icons/fa";
import { obtenerItems, eliminarItem, reactivarItem  } from '../../../api/items';

export default function Tienda() {
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarItems();
  }, []);

  useEffect(() => {
    filtrarItems();
  }, [items, searchTerm]);

  const cargarItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerItems();
      
      if (response.ok) {
        const itemsData = response.items || [];
        setItems(itemsData);
      } else {
        setError(`Error al cargar los avatares: ${response.error || 'Error desconocido'}`);
        setItems([]);
      }
    } catch (error) {
      console.error('Error cargando avatares:', error);
      setError(`Error al cargar los avatares: ${error.message || 'Error de conexión'}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarItems = () => {
    let filtrados = items;

    if (searchTerm) {
      filtrados = filtrados.filter(item => {
        const nombreMatch = item.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const descripcionMatch = item.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        return nombreMatch || descripcionMatch;
      });
    }

    setFilteredItems(filtrados);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCreateItem = () => {
    setShowCreateModal(true); 
  };

  const handleCloseModal = () => {
    setShowCreateModal(false); 
  };

  const handleModalSuccess = () => {
    console.log('Item creado exitosamente');
    cargarItems(); 
  };

  const handleEditItem = (itemId) => {
    console.log('Editar item:', itemId);
    setSelectedItemId(itemId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItemId(null);
  };

  const handleEditSuccess = () => {
    console.log('Item editado exitosamente');
    cargarItems(); 
  };

 const handleDeleteItem = async (itemId) => {
  const item = items.find(i => i.id_item === itemId);
  
  if (!item) {
    console.error('Item no encontrado');
    return;
  }

  
  const accion = item.disponible ? 'deshabilitar' : 'reactivar';
  const confirmar = window.confirm(
    `¿Estás seguro de ${accion} el item "${item.nombre}"?`
  );
  
  if (!confirmar) return;
  
  try {
    setEliminando(itemId);
    
    
    const resultado = item.disponible 
      ? await eliminarItem(itemId)
      : await reactivarItem(itemId);
    
    if (resultado.ok) {
      alert(`Item ${item.disponible ? 'deshabilitado' : 'reactivado'} exitosamente`);
      cargarItems(); 
    } else {
      alert(resultado.error);
    }
  } catch (error) {
    alert('Error inesperado al actualizar el item');
    console.error(error);
  } finally {
    setEliminando(null);
  }
};

  const handleViewItem = (itemId) => {
    navigate(`/admin/tienda/${itemId}`);
  };

  // Calcular estadísticas
  const totalComprados = items.reduce((sum, i) => sum + (i.comprados || 0), 0);
  const masVendido = items.length > 0 
    ? items.reduce((max, i) => (i.comprados || 0) > (max.comprados || 0) ? i : max, items[0])
    : null;
  const promedioPrecio = items.length > 0
    ? Math.round(items.reduce((sum, i) => sum + i.precio, 0) / items.length)
    : 0;

  const estadisticas = {
    total: items.length,
    totalComprados: totalComprados,
    masVendido: masVendido ? masVendido.nombre : '-',
    promedioPrecio: promedioPrecio
  };

  return (
    <>
      <h1 className="admin-page-title admin-tienda-title">🛍️ Gestión de Tienda</h1>
      
      <AdminActionsBar 
        btnTitle="Nuevo Avatar" 
        placeholderTitle="Buscar avatar..." 
        btnClassName="btnAdd" 
        btnStyle={gradients.purpleGradient}
        onSearch={handleSearch}
        onBtnClick={handleCreateItem}
      />

      <div className="admin-page-container admin-tienda-container">
        <div className="stats-grid">
          <CardStats 
            icon={<FaShoppingCart color="#9c27b0"/>} 
            number={estadisticas.total} 
            label="Total avatares"
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
            <p>Cargando items...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn-retry" onClick={cargarItems}>
                Reintentar
              </button>
            </div>
          </div>
        ) : (
          <TiendaTable 
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onView={handleViewItem}
            searchTerm={searchTerm}
          />
        )}
      </div>

      <CreateItemModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />

      <EditarItemModal
        estaAbierto={showEditModal}
        alCerrar={handleCloseEditModal}
        alActualizar={handleEditSuccess}
        itemId={selectedItemId}
      />
    </>
  );
}