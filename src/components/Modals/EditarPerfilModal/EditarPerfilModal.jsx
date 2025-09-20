import React, { useState, useEffect } from 'react';
import { FaUser, FaKey, FaSave, FaTimes, FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { obtenerPerfilAdministradorDesdeContext, actualizarPerfilAdministrador, cambiarContrasenaAdministrador } from '../../../api/perfil';
import { useAuth } from '../../../auth/AuthContext';
import './EditarPerfilModal.css';

const EditarPerfilModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  // Estados principales
  const [perfil, setPerfil] = useState(null);
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para formulario de datos personales
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    dni: ''
  });

  // Estados para formulario de cambio de contraseña
  const [contrasenaData, setContrasenaData] = useState({
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: ''
  });

  // Cargar perfil al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarPerfil();
    }
  }, [isOpen]);

  // Limpiar estados al cerrar
  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
      setActiveTab('perfil');
      setContrasenaData({
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: ''
      });
    }
  }, [isOpen]);

  // Función para cargar perfil desde API
  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      
      const data = await obtenerPerfilAdministradorDesdeContext(user);
      setPerfil(data);
      
      // Llenar formulario con datos actuales
      setFormData({
        nombre: data.usuario.nombre || '',
        apellido: data.usuario.apellido || '',
        email: data.usuario.email || '',
        edad: data.usuario.edad || '',
        dni: data.dni || ''
      });
      
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError(err.message || 'Error cargando perfil');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Solo enviar campos que cambiaron
      const cambios = {};
      Object.keys(formData).forEach(key => {
        if (key === 'dni') {
          if (formData[key] !== perfil.dni) {
            cambios[key] = formData[key];
          }
        } else {
          if (formData[key] !== perfil.usuario[key]) {
            cambios[key] = formData[key];
          }
        }
      });

      if (Object.keys(cambios).length === 0) {
        setError('No hay cambios para guardar');
        return;
      }

      await actualizarPerfilAdministrador(cambios);
      setSuccess('Perfil actualizado exitosamente');
      
      // Recargar perfil para mostrar cambios
      await cargarPerfil();
      
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.message || 'Error actualizando perfil');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handleSubmitContrasena = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validaciones
      if (contrasenaData.nueva_contrasena !== contrasenaData.confirmar_contrasena) {
        setError('Las contraseñas nuevas no coinciden');
        return;
      }
      if (contrasenaData.nueva_contrasena.length < 8) {
        setError('La nueva contraseña debe tener al menos 8 caracteres');
        return;
      }

      await cambiarContrasenaAdministrador({
        contrasena_actual: contrasenaData.contrasena_actual,
        nueva_contrasena: contrasenaData.nueva_contrasena
      });

      setSuccess('Contraseña cambiada exitosamente');
      setContrasenaData({
        contrasena_actual: '',
        nueva_contrasena: '',
        confirmar_contrasena: ''
      });
      
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setError(err.message || 'Error cambiando contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContrasenaChange = (e) => {
    const { name, value } = e.target;
    setContrasenaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="editar-perfil-modal-overlay">
      <div className="editar-perfil-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            <FaUser className="title-icon" />
            Editar Perfil de Administrador
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            <FaUser className="tab-icon" />
            Datos Personales
          </button>
          <button 
            className={`tab-btn ${activeTab === 'contrasena' ? 'active' : ''}`}
            onClick={() => setActiveTab('contrasena')}
          >
            <FaKey className="tab-icon" />
            Cambiar Contraseña
          </button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="message error-message">
            <FaExclamationTriangle className="message-icon" />
            {error}
          </div>
        )}
        {success && (
          <div className="message success-message">
            <FaCheck className="message-icon" />
            {success}
          </div>
        )}

        {/* Contenido del modal */}
        <div className="modal-content">
          {loading && !perfil ? (
            <div className="loading-container">
              <FaSpinner className="spinner" />
              <p>Cargando perfil...</p>
            </div>
          ) : (
            <>
              {/* Formulario de Datos Personales */}
              {activeTab === 'perfil' && (
                <form onSubmit={handleSubmitPerfil} className="perfil-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre *</label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                        minLength="2"
                        maxLength="50"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="apellido">Apellido *</label>
                      <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        required
                        minLength="2"
                        maxLength="50"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="edad">Edad *</label>
                      <input
                        type="number"
                        id="edad"
                        name="edad"
                        value={formData.edad}
                        onChange={handleInputChange}
                        required
                        min="18"
                        max="120"
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="dni">DNI *</label>
                      <input
                        type="text"
                        id="dni"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? (
                        <>
                          <FaSpinner className="btn-spinner" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Formulario de Cambio de Contraseña */}
              {activeTab === 'contrasena' && (
                <form onSubmit={handleSubmitContrasena} className="contrasena-form">
                  <div className="form-group">
                    <label htmlFor="contrasena_actual">Contraseña Actual *</label>
                    <input
                      type="password"
                      id="contrasena_actual"
                      name="contrasena_actual"
                      value={contrasenaData.contrasena_actual}
                      onChange={handleContrasenaChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nueva_contrasena">Nueva Contraseña *</label>
                    <input
                      type="password"
                      id="nueva_contrasena"
                      name="nueva_contrasena"
                      value={contrasenaData.nueva_contrasena}
                      onChange={handleContrasenaChange}
                      required
                      minLength="8"
                      disabled={loading}
                    />
                    <small className="form-help">Mínimo 8 caracteres</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmar_contrasena">Confirmar Nueva Contraseña *</label>
                    <input
                      type="password"
                      id="confirmar_contrasena"
                      name="confirmar_contrasena"
                      value={contrasenaData.confirmar_contrasena}
                      onChange={handleContrasenaChange}
                      required
                      minLength="8"
                      disabled={loading}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? (
                        <>
                          <FaSpinner className="btn-spinner" />
                          Cambiando...
                        </>
                      ) : (
                        <>
                          <FaKey />
                          Cambiar Contraseña
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal;
