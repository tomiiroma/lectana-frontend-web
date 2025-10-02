import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaCalendarAlt, FaBook, FaUser, FaUsers, FaClipboardList } from 'react-icons/fa';
import { crearActividadCompleta } from '../../../api/actividades';
import { obtenerTodosLosCuentos } from '../../../api/cuentos';
import { obtenerDocentes } from '../../../api/docentes';
import { listarAulas } from '../../../api/aulas';
import './CreateActividadModal.css';

const CreateActividadModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    tipo: 'multiple_choice',
    fecha_entrega: '',
    cuento_id_cuento: '',
    docente_id_docente: '',
    aulas: []
  });

  const [cuentos, setCuentos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
    }
  }, [isOpen]);

  const cargarDatos = async () => {
    try {
      const [cuentosData, docentesData, aulasData] = await Promise.all([
        obtenerTodosLosCuentos(),
        obtenerDocentes(),
        listarAulas()
      ]);

      setCuentos(cuentosData.data || []);
      setDocentes(docentesData.docentes || []);
      setAulas(aulasData || []); // listarAulas() retorna directamente el array
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAulaToggle = (aulaId) => {
    setFormData(prev => ({
      ...prev,
      aulas: prev.aulas.includes(aulaId)
        ? prev.aulas.filter(id => id !== aulaId)
        : [...prev.aulas, aulaId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (formData.fecha_entrega && new Date(formData.fecha_entrega) < new Date()) {
      newErrors.fecha_entrega = 'La fecha de entrega no puede ser anterior a hoy';
    }

    if (formData.aulas.length === 0) {
      newErrors.aulas = 'Debe seleccionar al menos un aula';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const actividadData = {
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        fecha_entrega: formData.fecha_entrega || null
      };

      await crearActividadCompleta(
        actividadData,
        formData.cuento_id_cuento || null,
        formData.docente_id_docente || null,
        formData.aulas
      );

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creando actividad:', error);
      setErrors({ submit: 'Error al crear la actividad. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descripcion: '',
      tipo: 'multiple_choice',
      fecha_entrega: '',
      cuento_id_cuento: '',
      docente_id_docente: '',
      aulas: []
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container create-actividad-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <FaClipboardList className="modal-icon" />
            Crear Nueva Actividad
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3 className="section-title">Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">
                <FaClipboardList className="label-icon" />
                Descripción de la Actividad *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`form-textarea ${errors.descripcion ? 'error' : ''}`}
                placeholder="Describe la actividad que van a realizar los estudiantes..."
                rows="4"
              />
              {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tipo" className="form-label">
                <FaClipboardList className="label-icon" />
                Tipo de Actividad *
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={`form-select ${errors.tipo ? 'error' : ''}`}
              >
                <option value="multiple_choice">Opción Múltiple</option>
                <option value="respuesta_abierta">Respuesta Abierta</option>
              </select>
              {errors.tipo && <span className="error-message">{errors.tipo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fecha_entrega" className="form-label">
                <FaCalendarAlt className="label-icon" />
                Fecha de Entrega
              </label>
              <input
                type="datetime-local"
                id="fecha_entrega"
                name="fecha_entrega"
                value={formData.fecha_entrega}
                onChange={handleInputChange}
                className={`form-input ${errors.fecha_entrega ? 'error' : ''}`}
              />
              {errors.fecha_entrega && <span className="error-message">{errors.fecha_entrega}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Asignaciones (Opcional)</h3>
            
            <div className="form-group">
              <label htmlFor="cuento_id_cuento" className="form-label">
                <FaBook className="label-icon" />
                Cuento Relacionado
              </label>
              <select
                id="cuento_id_cuento"
                name="cuento_id_cuento"
                value={formData.cuento_id_cuento}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Seleccionar cuento...</option>
                {cuentos.map(cuento => (
                  <option key={cuento.id_cuento} value={cuento.id_cuento}>
                    {cuento.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="docente_id_docente" className="form-label">
                <FaUser className="label-icon" />
                Docente Responsable
              </label>
              <select
                id="docente_id_docente"
                name="docente_id_docente"
                value={formData.docente_id_docente}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Seleccionar docente...</option>
                {docentes.map(docente => (
                  <option key={docente.id_docente} value={docente.id_docente}>
                    {docente.nombre} {docente.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Aulas Asignadas *</h3>
            
            <div className="aulas-selection">
              <div className="aulas-grid">
                {aulas.map(aula => (
                  <div
                    key={aula.id_aula}
                    className={`aula-item ${formData.aulas.includes(aula.id_aula) ? 'selected' : ''}`}
                    onClick={() => handleAulaToggle(aula.id_aula)}
                  >
                    <div className="aula-checkbox">
                      {formData.aulas.includes(aula.id_aula) && <FaPlus className="check-icon" />}
                    </div>
                    <div className="aula-info">
                      <div className="aula-name">{aula.nombre}</div>
                      <div className="aula-details">
                        <FaUsers className="aula-icon" />
                        {aula.capacidad || 'N/A'} estudiantes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.aulas && <span className="error-message">{errors.aulas}</span>}
            </div>
          </div>

          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Actividad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActividadModal;
