import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { obtenerDocentePorId } from '../../../api/docentes';
import { obtenerAlumnoPorId } from '../../../api/alumnos';
import { obtenerAdministradorPorId } from '../../../api/administradores';
import { obtenerPerfilPorIdUsuario } from '../../../api/usuarios';
import PerfilEstudiante from '../../Perfil/PerfilEstudiante/PerfilEstudiante';
import PerfilDocente from '../../Perfil/PerfilDocente/PerfilDocente';
import PerfilAdmin from '../../Perfil/PerfilAdmin/PerfilAdmin';
import PerfilUsuario from '../../Perfil/PerfilUsuario/PerfilUsuario';
import './ModalPerfil.css';

const ModalPerfil = ({ estaAbierto, alCerrar, tipoUsuario, idUsuario, esTablaMixta = false }) => {
  const [datosPerfil, setDatosPerfil] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [ultimaPeticionTiempo, setUltimaPeticionTiempo] = useState(0);

  useEffect(() => {
    if (estaAbierto && idUsuario) {
      cargarDatosPerfil();
    }
  }, [estaAbierto, idUsuario]);

  const cargarDatosPerfil = async () => {
    // Verificar debouncing (evitar múltiples peticiones)
    const ahora = Date.now();
    if (ahora - ultimaPeticionTiempo < 1000) {
      console.log('⏳ Esperando antes de hacer otra petición...');
      return;
    }
    
    setUltimaPeticionTiempo(ahora);
    setCargando(true);
    setError(null);
    
    try {
      console.log(`🔄 Cargando perfil de ${tipoUsuario} con ID: ${idUsuario}`);
      console.log(`🔍 Es tabla mixta: ${esTablaMixta}`);
      
      let datos;
      
      if (esTablaMixta) {
        // Para tablas mixtas, usar la función que acepta id_usuario
        console.log('🔄 Usando función para tabla mixta...');
        datos = await obtenerPerfilPorIdUsuario(idUsuario);
      } else {
        // Para tablas específicas, usar las funciones específicas del rol
        switch (tipoUsuario) {
          case 'docente':
            datos = await obtenerDocentePorId(idUsuario);
            break;
          case 'estudiante':
          case 'alumno':
            datos = await obtenerAlumnoPorId(idUsuario);
            break;
          case 'administrador':
            datos = await obtenerAdministradorPorId(idUsuario);
            break;
          default:
            throw new Error('Tipo de usuario no válido');
        }
      }
      
      console.log('✅ Perfil cargado:', datos);
      console.log('🔍 Tipo de usuario:', tipoUsuario);
      console.log('🔍 ID del usuario:', idUsuario);
      
      if (!datos) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      setDatosPerfil(datos);
      
    } catch (err) {
      console.error('❌ Error cargando perfil:', err);
      
      // Manejo específico del error 429 (Too Many Requests)
      if (err.response?.status === 429) {
        setError('Demasiadas peticiones. Por favor espera unos segundos antes de intentar nuevamente.');
      } else {
        setError(err.message || 'Error al cargar el perfil');
      }
    } finally {
      setCargando(false);
    }
  };

  if (!estaAbierto) return null;

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">Perfil de Usuario</h2>
          <button className="modal-close" onClick={alCerrar}>
            <FaTimes />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="modal-body">
          {cargando && (
            <div className="profile-loading">
              <FaSpinner className="spinner" />
              <span>Cargando perfil...</span>
            </div>
          )}

          {error && (
            <div className="profile-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              {error.includes('Demasiadas peticiones') && (
                <button 
                  className="retry-button"
                  onClick={() => {
                    setError(null);
                    cargarDatosPerfil();
                  }}
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {datosPerfil && !cargando && !error && (
            <div className="profile-content">
              {/* Renderizar componente específico según el tipo de usuario */}
              {(() => {
                console.log('🎯 Renderizando perfil para tipo:', tipoUsuario);
                console.log('🎯 Datos del perfil:', datosPerfil);
                console.log('🎯 Es tabla mixta:', esTablaMixta);
                
                if (esTablaMixta) {
                  // Para tablas mixtas, usar el componente genérico
                  return <PerfilUsuario datosUsuario={datosPerfil} rolUsuario={tipoUsuario} />;
                } else {
                  // Para tablas específicas, usar los componentes específicos
                  if (tipoUsuario === 'estudiante' || tipoUsuario === 'alumno') {
                    return <PerfilEstudiante datosEstudiante={datosPerfil} />;
                  } else if (tipoUsuario === 'docente') {
                    return <PerfilDocente datosDocente={datosPerfil} />;
                  } else if (tipoUsuario === 'administrador') {
                    return <PerfilAdmin datosAdmin={datosPerfil} />;
                  } else {
                    return (
                      <div className="profile-placeholder">
                        <p>Tipo de usuario no reconocido: {tipoUsuario}</p>
                      </div>
                    );
                  }
                }
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPerfil;
