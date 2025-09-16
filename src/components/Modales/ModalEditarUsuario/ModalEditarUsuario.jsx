import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaSave, FaUserEdit } from 'react-icons/fa';
import { actualizarDocenteAdmin } from '../../../api/docentes';
import { actualizarAlumnoAdmin } from '../../../api/alumnos';
import { actualizarAdministradorAdmin } from '../../../api/administradores';
import './ModalEditarUsuario.css';

const ModalEditarUsuario = ({ 
  estaAbierto, 
  alCerrar, 
  usuarioSeleccionado,
  tipoUsuario = 'usuario',
  alActualizarExitoso
}) => {
  const [formData, setFormData] = useState({
    // Campos comunes para todos
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    activo: true,
    telefono: '',
    // Campos específicos para docentes
    institucion_nombre: '',
    institucion_pais: '',
    institucion_provincia: '',
    nivel_educativo: 'PRIMARIA',
    verificado: false,
    // Campos específicos para alumnos
    nacionalidad: '',
    alumno_col: '',
    aula_id_aula: '',
    // Campos específicos para administradores
    dni: '',
    usuario_id_usuario: ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [camposModificados, setCamposModificados] = useState({});

  useEffect(() => {
    if (estaAbierto && usuarioSeleccionado) {
      // Cargar datos del usuario seleccionado
      console.log('🔍 Usuario seleccionado para editar:', usuarioSeleccionado);
      console.log('🔍 Tipo de usuario:', tipoUsuario);
      
      // Extraer datos del usuario (que está anidado en la estructura del backend)
      const datosUsuario = usuarioSeleccionado.usuario || usuarioSeleccionado;
      
      const datosIniciales = {
        // Campos básicos del usuario
        nombre: datosUsuario.nombre || '',
        apellido: datosUsuario.apellido || '',
        email: datosUsuario.email || '',
        edad: datosUsuario.edad || '',
        activo: datosUsuario.activo !== undefined ? datosUsuario.activo : true,
        
        // Campos específicos para docentes
        telefono: usuarioSeleccionado.telefono || '',
        institucion_nombre: usuarioSeleccionado.institucion_nombre || '',
        institucion_pais: usuarioSeleccionado.institucion_pais || '',
        institucion_provincia: usuarioSeleccionado.institucion_provincia || '',
        nivel_educativo: usuarioSeleccionado.nivel_educativo || 'PRIMARIA',
        verificado: usuarioSeleccionado.verificado || false,
        
        // Campos específicos para alumnos
        nacionalidad: usuarioSeleccionado.nacionalidad || '',
        alumno_col: usuarioSeleccionado.alumno_col || '',
        aula_id_aula: usuarioSeleccionado.aula_id_aula || '',
        
        // Campos específicos para administradores
        dni: usuarioSeleccionado.dni || '',
        usuario_id_usuario: usuarioSeleccionado.usuario_id_usuario || ''
      };
      
      console.log('🔍 Datos iniciales procesados:', datosIniciales);
      
      setFormData(datosIniciales);
      setCamposModificados({});
      setError(null);
    }
  }, [estaAbierto, usuarioSeleccionado, tipoUsuario]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let valor;
    
    if (type === 'checkbox') {
      valor = checked;
    } else if (name === 'activo') {
      // Convertir string a boolean para el campo activo
      valor = value === 'true';
    } else {
      valor = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: valor
    }));
    
    // Marcar campo como modificado
    setCamposModificados(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      // Preparar datos modificados según el tipo de usuario
      const datosModificados = {};
      Object.keys(camposModificados).forEach(campo => {
        if (camposModificados[campo]) {
          let valor = formData[campo];
          
          // Convertir tipos de datos según el campo
          if (campo === 'edad') {
            valor = parseInt(valor, 10);
          } else if (campo === 'aula_id_aula') {
            valor = valor ? parseInt(valor, 10) : null;
          } else if (campo === 'activo') {
            valor = Boolean(valor);
          } else if (campo === 'verificado') {
            valor = Boolean(valor);
          }
          
          datosModificados[campo] = valor;
        }
      });

      // Agregar ID del usuario según el tipo
      let userId;
      switch (tipoUsuario.toLowerCase()) {
        case 'docente':
        case 'docentes':
          userId = usuarioSeleccionado?.id_docente;
          break;
        case 'estudiante':
        case 'estudiantes':
        case 'alumno':
        case 'alumnos':
          userId = usuarioSeleccionado?.id_alumno;
          break;
        case 'administrador':
        case 'administradores':
          userId = usuarioSeleccionado?.id_administrador;
          break;
        default:
          userId = usuarioSeleccionado?.id_usuario || usuarioSeleccionado?.usuario?.id_usuario;
      }

      console.log('💾 Guardando cambios:', { userId, tipoUsuario, datosModificados });
      console.log('💾 FormData completo:', formData);
      console.log('💾 Campos modificados:', camposModificados);
      
      let resultado;
      
      // Llamar función específica según el tipo de usuario
      switch (tipoUsuario.toLowerCase()) {
        case 'docente':
        case 'docentes':
          resultado = await actualizarDocenteAdmin(userId, datosModificados);
          break;
        case 'estudiante':
        case 'estudiantes':
        case 'alumno':
        case 'alumnos':
          resultado = await actualizarAlumnoAdmin(userId, datosModificados);
          break;
        case 'administrador':
        case 'administradores':
          resultado = await actualizarAdministradorAdmin(userId, datosModificados);
          break;
        default:
          throw new Error('Tipo de usuario no válido');
      }
      
      console.log('✅ Usuario actualizado exitosamente:', resultado);
      
      // Notificar éxito al componente padre
      if (alActualizarExitoso) {
        alActualizarExitoso(resultado, tipoUsuario);
      }
      
      // Cerrar modal después de guardar exitosamente
      alCerrar();
      
    } catch (err) {
      console.error('❌ Error guardando cambios:', err);
      setError(err.response?.data?.error || err.message || 'Error al guardar los cambios');
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setError(null);
    alCerrar();
  };

  // Función para renderizar campos específicos según el tipo de usuario
  const renderCamposEspecificos = () => {
    const tipo = tipoUsuario.toLowerCase();
    switch (tipo) {
      case 'docente':
      case 'docentes':
        return (
          <>
            <div className="form-group">
              <label htmlFor="institucion_nombre">Institución *</label>
              <input
                type="text"
                id="institucion_nombre"
                name="institucion_nombre"
                value={formData.institucion_nombre}
                onChange={handleInputChange}
                required
                minLength="1"
                className={camposModificados.institucion_nombre ? 'modified' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="institucion_pais">País *</label>
              <input
                type="text"
                id="institucion_pais"
                name="institucion_pais"
                value={formData.institucion_pais}
                onChange={handleInputChange}
                required
                minLength="1"
                className={camposModificados.institucion_pais ? 'modified' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="institucion_provincia">Provincia *</label>
              <input
                type="text"
                id="institucion_provincia"
                name="institucion_provincia"
                value={formData.institucion_provincia}
                onChange={handleInputChange}
                required
                minLength="1"
                className={camposModificados.institucion_provincia ? 'modified' : ''}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nivel_educativo">Nivel Educativo *</label>
              <select
                id="nivel_educativo"
                name="nivel_educativo"
                value={formData.nivel_educativo}
                onChange={handleInputChange}
                required
                className={camposModificados.nivel_educativo ? 'modified' : ''}
              >
                <option value="PRIMARIA">Primaria</option>
                <option value="SECUNDARIA">Secundaria</option>
                <option value="AMBOS">Ambos</option>
              </select>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="verificado"
                  checked={formData.verificado}
                  onChange={handleInputChange}
                  className={camposModificados.verificado ? 'modified' : ''}
                />
                <span className="checkbox-text">Usuario Verificado</span>
              </label>
            </div>
          </>
        );
        
      case 'estudiante':
      case 'estudiantes':
      case 'alumno':
      case 'alumnos':
        return (
          <>
            <div className="form-group">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input
                type="text"
                id="nacionalidad"
                name="nacionalidad"
                value={formData.nacionalidad}
                onChange={handleInputChange}
                className={camposModificados.nacionalidad ? 'modified' : ''}
                placeholder="Opcional"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="alumno_col">Colegio</label>
              <input
                type="text"
                id="alumno_col"
                name="alumno_col"
                value={formData.alumno_col}
                onChange={handleInputChange}
                className={camposModificados.alumno_col ? 'modified' : ''}
                placeholder="Opcional"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="aula_id_aula">ID del Aula</label>
              <input
                type="number"
                id="aula_id_aula"
                name="aula_id_aula"
                value={formData.aula_id_aula}
                onChange={handleInputChange}
                className={camposModificados.aula_id_aula ? 'modified' : ''}
                placeholder="Opcional (puede ser null)"
              />
            </div>
          </>
        );
        
      case 'administrador':
      case 'administradores':
        return (
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
              className={camposModificados.dni ? 'modified' : ''}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!estaAbierto) return null;

  return (
    <div className="modal-overlay" onClick={handleCancelar}>
      <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del modal */}
        <div className="modal-header">
          <div className="modal-title-container">
            <FaUserEdit className="modal-icon" />
            <h2 className="modal-title">Editar {tipoUsuario.charAt(0).toUpperCase() + tipoUsuario.slice(1)}</h2>
          </div>
          <button className="modal-close" onClick={handleCancelar}>
            <FaTimes />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="modal-body">
          {error && (
            <div className="edit-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-grid">
              {/* Campos según especificación del backend */}
              {(tipoUsuario.toLowerCase() === 'docente' || tipoUsuario.toLowerCase() === 'docentes') && (
                <>
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
                      className={camposModificados.nombre ? 'modified' : ''}
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
                      className={camposModificados.apellido ? 'modified' : ''}
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
                      className={camposModificados.email ? 'modified' : ''}
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
                      max="80"
                      className={camposModificados.edad ? 'modified' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="activo">Estado</label>
                    <select
                      id="activo"
                      name="activo"
                      value={formData.activo}
                      onChange={handleInputChange}
                      className={camposModificados.activo ? 'modified' : ''}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className={camposModificados.telefono ? 'modified' : ''}
                      placeholder="Opcional"
                    />
                  </div>
                </>
              )}

              {(tipoUsuario.toLowerCase() === 'estudiante' || tipoUsuario.toLowerCase() === 'estudiantes' || tipoUsuario.toLowerCase() === 'alumno' || tipoUsuario.toLowerCase() === 'alumnos') && (
                <>
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
                      className={camposModificados.nombre ? 'modified' : ''}
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
                      className={camposModificados.apellido ? 'modified' : ''}
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
                      className={camposModificados.email ? 'modified' : ''}
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
                      min="5"
                      max="18"
                      className={camposModificados.edad ? 'modified' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="activo">Estado</label>
                    <select
                      id="activo"
                      name="activo"
                      value={formData.activo}
                      onChange={handleInputChange}
                      className={camposModificados.activo ? 'modified' : ''}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>
                </>
              )}

              {(tipoUsuario.toLowerCase() === 'administrador' || tipoUsuario.toLowerCase() === 'administradores') && (
                <>
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
                      className={camposModificados.nombre ? 'modified' : ''}
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
                      className={camposModificados.apellido ? 'modified' : ''}
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
                      className={camposModificados.email ? 'modified' : ''}
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
                      className={camposModificados.edad ? 'modified' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="activo">Estado</label>
                    <select
                      id="activo"
                      name="activo"
                      value={formData.activo}
                      onChange={handleInputChange}
                      className={camposModificados.activo ? 'modified' : ''}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Inactivo</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Campos específicos según el tipo de usuario */}
            <div className="form-section">
              <h3 className="section-title">Información Específica</h3>
              <div className="form-grid">
                {renderCamposEspecificos()}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancelar}
                className="btn btn-secondary"
                disabled={cargando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <FaSpinner className="spinner" />
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
        </div>
      </div>
    </div>
  );
};

export default ModalEditarUsuario;
