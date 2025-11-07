import React, { useState, useEffect } from 'react';
import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import TiendaTable from "../../../components/TableTienda/TableTienda";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Tienda.css";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUsers, FaStar, FaCoins, FaPlus } from "react-icons/fa";
import { obtenerItems } from '../../../api/items';

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
    console.log('Avatar creado exitosamente');
    cargarItems(); 
  };

  const handleEditItem = (itemId) => {
    console.log('Editar avatar:', itemId);
    setSelectedItemId(itemId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedItemId(null);
  };

  const handleEditSuccess = () => {
    console.log('Avatar editado exitosamente');
    cargarItems(); 
  };

  const handleDeleteItem = async (itemId) => {
    const item = items.find(i => i.id_item === itemId);
    
    if (!item) {
      console.error('Avatar no encontrado');
      return;
    }

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar el avatar "${item.nombre}"?\n\n` +
      `Esta acción no se puede deshacer.`
    );
    
    if (!confirmar) return;
    
    try {
      setEliminando(itemId); 
      
      // TODO: Reemplazar con tu API cuando esté lista
      // const resultado = await eliminarItem(itemId);
      
      // MOCK - Simula eliminación exitosa
      const resultado = { ok: true };
      
      if (resultado.ok) {
        alert('Avatar eliminado exitosamente');
        setItems(items.filter(i => i.id_item !== itemId));
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

      {/* TODO: Agregar modales de Crear y Editar Item cuando estén listos */}
      {/* <CreateItemModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
      />

      <EditarItemModal
        estaAbierto={showEditModal}
        alCerrar={handleCloseEditModal}
        alActualizar={handleEditSuccess}
        itemId={selectedItemId}
      /> */}
    </>
  );
}