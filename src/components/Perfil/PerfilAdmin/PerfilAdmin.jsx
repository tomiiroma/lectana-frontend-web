import React from 'react';
import { FaUserShield, FaEnvelope, FaCalendarAlt, FaIdCard, FaCrown, FaUserCheck } from 'react-icons/fa';
import './PerfilAdmin.css';

const PerfilAdmin = ({ datosAdmin }) => {
  if (!datosAdmin) return null;

  const { usuario } = datosAdmin;
  
  // Validar que usuario existe y tiene las propiedades necesarias
  if (!usuario) {
    console.error('❌ PerfilAdmin: No hay datos de usuario en datosAdmin:', datosAdmin);
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span>Error: No se encontraron datos de usuario</span>
        </div>
      </div>
    );
  }
  
  if (!usuario.nombre || !usuario.apellido) {
    console.error('❌ PerfilAdmin: Datos de usuario incompletos:', usuario);
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span>Error: Datos de usuario incompletos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header del perfil */}
      <div className="profile-header admin-header">
        <div className="profile-avatar admin-avatar">
          <FaUserShield />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{usuario.nombre} {usuario.apellido}</h3>
          <p className="profile-role">Administrador</p>
          <div className={`profile-status ${usuario.activo ? 'active' : 'inactive'}`}>
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </div>

      {/* Información personal */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaIdCard className="section-icon" />
          Información Personal
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{usuario.nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Apellido:</span>
            <span className="info-value">{usuario.apellido}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{usuario.edad} años</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value email">{usuario.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">DNI:</span>
            <span className="info-value">{datosAdmin.dni}</span>
          </div>
        </div>
      </div>

      {/* Información administrativa */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaCrown className="section-icon" />
          Información Administrativa
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID Administrador:</span>
            <span className="info-value">#{datosAdmin.id_administrador}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID Usuario:</span>
            <span className="info-value">#{datosAdmin.usuario_id_usuario}</span>
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

      {/* Información del sistema */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaUserCheck className="section-icon" />
          Información del Sistema
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Fecha de Registro:</span>
            <span className="info-value">
              {datosAdmin.fecha_registro ? new Date(datosAdmin.fecha_registro).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Última Actualización:</span>
            <span className="info-value">
              {datosAdmin.fecha_actualizacion ? new Date(datosAdmin.fecha_actualizacion).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado de Cuenta:</span>
            <span className={`info-value ${usuario.activo ? 'account-active' : 'account-inactive'}`}>
              {usuario.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
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
  );
};

export default PerfilAdmin;
