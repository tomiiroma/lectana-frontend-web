import React from 'react';
import { FaUserGraduate, FaEnvelope, FaCalendarAlt, FaSchool, FaIdCard, FaGlobe } from 'react-icons/fa';
import './PerfilEstudiante.css';

const PerfilEstudiante = ({ datosEstudiante }) => {
  if (!datosEstudiante) return null;

  const { usuario } = datosEstudiante;
  
  // Validar que usuario existe y tiene las propiedades necesarias
  if (!usuario) {
    console.error('❌ PerfilEstudiante: No hay datos de usuario en datosEstudiante:', datosEstudiante);
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span>Error: No se encontraron datos de usuario</span>
        </div>
      </div>
    );
  }
  
  if (!usuario.nombre || !usuario.apellido) {
    console.error('❌ PerfilEstudiante: Datos de usuario incompletos:', usuario);
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
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUserGraduate />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{usuario.nombre} {usuario.apellido}</h3>
          <p className="profile-role">Estudiante</p>
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
        </div>
      </div>

      {/* Información académica */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaSchool className="section-icon" />
          Información Académica
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID Estudiante:</span>
            <span className="info-value">#{datosEstudiante.id_alumno}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Aula:</span>
            <span className="info-value">
              {datosEstudiante.aula_id_aula ? `Aula #${datosEstudiante.aula_id_aula}` : 'Sin asignar'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Nacionalidad:</span>
            <span className="info-value">
              {datosEstudiante.nacionalidad || 'No especificada'}
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {(datosEstudiante.alumno_col || datosEstudiante.nacionalidad) && (
        <div className="profile-section">
          <h4 className="section-title">
            <FaGlobe className="section-icon" />
            Información Adicional
          </h4>
          <div className="info-grid">
            {datosEstudiante.alumno_col && (
              <div className="info-item">
                <span className="info-label">Colegio:</span>
                <span className="info-value">{datosEstudiante.alumno_col}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilEstudiante;
