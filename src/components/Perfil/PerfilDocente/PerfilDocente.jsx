import React from 'react';
import { FaChalkboardTeacher, FaEnvelope, FaCalendarAlt, FaSchool, FaIdCard, FaPhone, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import './PerfilDocente.css';

const PerfilDocente = ({ datosDocente }) => {
  if (!datosDocente) return null;

  const { usuario } = datosDocente;
  
  // Validar que usuario existe y tiene las propiedades necesarias
  if (!usuario) {
    console.error('❌ PerfilDocente: No hay datos de usuario en datosDocente:', datosDocente);
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span>Error: No se encontraron datos de usuario</span>
        </div>
      </div>
    );
  }
  
  if (!usuario.nombre || !usuario.apellido) {
    console.error('❌ PerfilDocente: Datos de usuario incompletos:', usuario);
    return (
      <div className="profile-container">
        <div className="profile-error">
          <span>Error: Datos de usuario incompletos</span>
        </div>
      </div>
    );
  }

  const getNivelEducativoLabel = (nivel) => {
    switch (nivel) {
      case 'PRIMARIA': return 'Primaria';
      case 'SECUNDARIA': return 'Secundaria';
      case 'AMBOS': return 'Primaria y Secundaria';
      default: return nivel;
    }
  };

  return (
    <div className="profile-container">
      {/* Header del perfil */}
      <div className="profile-header teacher-header">
        <div className="profile-avatar teacher-avatar">
          <FaChalkboardTeacher />
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{usuario.nombre} {usuario.apellido}</h3>
          <p className="profile-role">Docente</p>
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
            <span className="info-value">{datosDocente.dni}</span>
          </div>
          {datosDocente.telefono && (
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{datosDocente.telefono}</span>
            </div>
          )}
        </div>
      </div>

      {/* Información profesional */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaSchool className="section-icon" />
          Información Profesional
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">ID Docente:</span>
            <span className="info-value">#{datosDocente.id_docente}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Institución:</span>
            <span className="info-value">{datosDocente.institucion_nombre}</span>
          </div>
          <div className="info-item">
            <span className="info-label">País:</span>
            <span className="info-value">{datosDocente.institucion_pais}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Provincia:</span>
            <span className="info-value">{datosDocente.institucion_provincia}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Nivel Educativo:</span>
            <span className="info-value">{getNivelEducativoLabel(datosDocente.nivel_educativo)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Verificado:</span>
            <span className={`info-value ${datosDocente.verificado ? 'verified' : 'not-verified'}`}>
              {datosDocente.verificado ? 'Sí' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="profile-section">
        <h4 className="section-title">
          <FaGraduationCap className="section-icon" />
          Información Adicional
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Fecha de Registro:</span>
            <span className="info-value">
              {datosDocente.fecha_registro ? new Date(datosDocente.fecha_registro).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Última Actualización:</span>
            <span className="info-value">
              {datosDocente.fecha_actualizacion ? new Date(datosDocente.fecha_actualizacion).toLocaleDateString() : 'No disponible'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilDocente;
