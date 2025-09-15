import React from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaIdCard, FaUserCheck } from 'react-icons/fa';
import './PerfilUsuario.css';

const PerfilUsuario = ({ datosUsuario, rolUsuario }) => {
  if (!datosUsuario) return null;

  const getRoleIcon = () => {
    switch (rolUsuario) {
      case 'docente':
        return '👨‍🏫';
      case 'alumno':
        return '👨‍🎓';
      case 'administrador':
        return '🛡️';
      default:
        return '👤';
    }
  };

  const getRoleLabel = () => {
    switch (rolUsuario) {
      case 'docente':
        return 'Docente';
      case 'alumno':
        return 'Estudiante';
      case 'administrador':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = () => {
    switch (rolUsuario) {
      case 'docente':
        return 'green';
      case 'alumno':
        return 'blue';
      case 'administrador':
        return 'purple';
      default:
        return 'blue';
    }
  };

  return (
    <div className="profile-container">
      {/* Header del perfil */}
      <div className={`profile-header user-header user-header-${getRoleColor()}`}>
        <div className={`profile-avatar user-avatar user-avatar-${getRoleColor()}`}>
          <FaUser />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{datosUsuario.nombre} {datosUsuario.apellido}</h3>
          <p className="profile-role">{getRoleLabel()}</p>
          <div className={`profile-status ${datosUsuario.activo ? 'active' : 'inactive'}`}>
            {datosUsuario.activo ? 'Activo' : 'Inactivo'}
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
            <span className="info-value">{datosUsuario.nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Apellido:</span>
            <span className="info-value">{datosUsuario.apellido}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{datosUsuario.edad} años</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value email">{datosUsuario.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">ID Usuario:</span>
            <span className="info-value">#{datosUsuario.id_usuario}</span>
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
              {datosUsuario.created_at ? new Date(datosUsuario.created_at).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Última Actualización:</span>
            <span className="info-value">
              {datosUsuario.updated_at ? new Date(datosUsuario.updated_at).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Estado de Cuenta:</span>
            <span className={`info-value ${datosUsuario.activo ? 'account-active' : 'account-inactive'}`}>
              {datosUsuario.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
            </span>
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="profile-note">
        <div className="note-icon">ℹ️</div>
        <div className="note-content">
          <strong>Información básica</strong>
          <p>Esta es la información básica del usuario. Para ver detalles específicos del rol (institución, aula, DNI, etc.), utiliza las tablas específicas correspondientes.</p>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
