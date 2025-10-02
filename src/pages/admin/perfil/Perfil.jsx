import React, { useState, useEffect } from 'react';
import "../AdminPages.css";
import "./Perfil.css";
import { FaSave, FaEdit, FaKey, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaShieldAlt, FaBell, FaPalette, FaLanguage, FaClock, FaUserShield, FaIdCard, FaCrown, FaUserCheck, FaSpinner } from "react-icons/fa";
import { obtenerPerfilAdministradorDesdeContext } from '../../../api/perfil';
import { useAuth } from '../../../auth/AuthContext';
import EditarPerfilModal from '../../../components/Modals/EditarPerfilModal/EditarPerfilModal';

export default function Perfil() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Cargar perfil al montar el componente
  useEffect(() => {
    cargarPerfil();
  }, [user]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      const data = await obtenerPerfilAdministradorDesdeContext(user);
      setPerfil(data);
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError(err.message || 'Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePerfilActualizado = () => {
    cargarPerfil(); // Recargar perfil después de actualizar
  };
  if (loading) {
    return (
      <>
        <h1 className="admin-page-title admin-perfil-title">⚙️ Mi Perfil</h1>
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Cargando perfil...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="admin-page-title admin-perfil-title">⚙️ Mi Perfil</h1>
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={cargarPerfil} className="btn-retry">
            Reintentar
          </button>
        </div>
      </>
    );
  }

  if (!perfil) {
    return (
      <>
        <h1 className="admin-page-title admin-perfil-title">⚙️ Mi Perfil</h1>
        <div className="error-container">
          <p>No se encontraron datos del perfil</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-page-title admin-perfil-title">⚙️ Mi Perfil</h1>
      
      <div className="perfil-layout">
        {/* Panel Izquierdo - Info Personal */}
        <div className="perfil-left">
          <div className="perfil-card">
            <div className="perfil-header">
              <div className="perfil-avatar">
                <FaUserShield className="avatar-icon" />
                <button className="avatar-edit-btn" onClick={() => setShowEditModal(true)}>
                  <FaEdit />
                </button>
              </div>
              <div className="perfil-info">
                <h2>{perfil.usuario.nombre} {perfil.usuario.apellido}</h2>
                <p className="perfil-role">Administrador</p>
                <p className="perfil-id">ID: #{perfil.id_administrador}</p>
                <div className={`perfil-status ${perfil.usuario.activo ? 'active' : 'inactive'}`}>
                  {perfil.usuario.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
            </div>
            
            <div className="perfil-stats">
              <div className="stat-item">
                <span className="stat-label">Email</span>
                <span className="stat-value">{perfil.usuario.email}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Edad</span>
                <span className="stat-value">{perfil.usuario.edad} años</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">DNI</span>
                <span className="stat-value">{perfil.dni}</span>
              </div>
            </div>
          </div>

          {/* Información Administrativa */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaCrown /> Información Administrativa
            </h3>
            <div className="admin-info">
              <div className="info-item">
                <span className="info-label">ID Administrador:</span>
                <span className="info-value">#{perfil.id_administrador}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID Usuario:</span>
                <span className="info-value">#{perfil.usuario_id_usuario}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nivel de Acceso:</span>
                <span className="info-value admin-level">Administrador Completo</span>
              </div>
              <div className="info-item">
                <span className="info-label">Permisos:</span>
                <span className="info-value admin-permissions">Acceso Total al Sistema</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Configuraciones */}
        <div className="perfil-right">
          {/* Información Personal */}
          <div className="perfil-card">
            <div className="card-header">
              <h3 className="card-title">
                <FaUser /> Información Personal
              </h3>
              <button className="btn-edit" onClick={() => setShowEditModal(true)}>
                <FaEdit /> Editar
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nombre:</span>
                <span className="info-value">{perfil.usuario.nombre}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Apellido:</span>
                <span className="info-value">{perfil.usuario.apellido}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value email">{perfil.usuario.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Edad:</span>
                <span className="info-value">{perfil.usuario.edad} años</span>
              </div>
              <div className="info-item">
                <span className="info-label">DNI:</span>
                <span className="info-value">{perfil.dni}</span>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaShieldAlt /> Seguridad
            </h3>
            <div className="security-section">
              <div className="security-item">
                <div className="security-info">
                  <h4>Cambiar Contraseña</h4>
                  <p>Actualiza tu contraseña regularmente para mayor seguridad</p>
                </div>
                <button className="btn-security" onClick={() => setShowEditModal(true)}>
                  <FaKey /> Cambiar
                </button>
              </div>
              
              <div className="security-item">
                <div className="security-info">
                  <h4>Estado de Cuenta</h4>
                  <p>Tu cuenta está {perfil.usuario.activo ? 'activa' : 'inactiva'}</p>
                </div>
                <div className={`status-badge ${perfil.usuario.activo ? 'active' : 'inactive'}`}>
                  {perfil.usuario.activo ? 'Activa' : 'Inactiva'}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="perfil-card">
            <h3 className="card-title">
              <FaUserCheck /> Información del Sistema
            </h3>
            <div className="system-info">
              <div className="info-item">
                <span className="info-label">Fecha de Registro:</span>
                <span className="info-value">
                  {perfil.usuario.created_at ? new Date(perfil.usuario.created_at).toLocaleDateString() : 'No disponible'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Última Actualización:</span>
                <span className="info-value">
                  {perfil.usuario.updated_at ? new Date(perfil.usuario.updated_at).toLocaleDateString() : 'No disponible'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado de Cuenta:</span>
                <span className={`info-value ${perfil.usuario.activo ? 'account-active' : 'account-inactive'}`}>
                  {perfil.usuario.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                </span>
              </div>
            </div>
          </div>

          {/* Badge de administrador */}
          <div className="admin-badge">
            <FaCrown className="badge-icon" />
            <span>Administrador del Sistema</span>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      <EditarPerfilModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
}


