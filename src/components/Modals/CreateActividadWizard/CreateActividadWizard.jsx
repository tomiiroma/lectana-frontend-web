import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaArrowRight, FaCheck, FaCalendarAlt, FaClipboardList, FaBook, FaUser, FaUsers } from 'react-icons/fa';
import { crearActividad, asignarDocente, asignarActividadAulas } from '../../../api/actividades';
import { obtenerTodosLosCuentos } from '../../../api/cuentos';
import { obtenerDocentes } from '../../../api/docentes';
import { listarAulas } from '../../../api/aulas';
import './CreateActividadWizard.css';

const CreateActividadWizard = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Paso 1: Crear actividad con cuento
  const [actividadData, setActividadData] = useState({
    descripcion: '',
    tipo: 'multiple_choice',
    fecha_entrega: '',
    cuento_id_cuento: '' // REQUERIDO
  });

  // Paso 2: Asignar docente
  const [docenteId, setDocenteId] = useState('');

  // Paso 3: Asignar aulas
  const [aulasIds, setAulasIds] = useState([]);

  // Datos para los dropdowns
  const [cuentos, setCuentos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);

  // ID de la actividad creada (para el paso 2)
  const [actividadId, setActividadId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      resetWizard();
    }
  }, [isOpen]);

  const resetWizard = () => {
    setCurrentStep(1);
    setActividadData({
      descripcion: '',
      tipo: 'multiple_choice',
      fecha_entrega: '',
      cuento_id_cuento: ''
    });
    setDocenteId('');
    setAulasIds([]);
    setActividadId(null);
    setErrors({});
  };

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

  const handleActividadDataChange = (e) => {
    const { name, value } = e.target;
    setActividadData(prev => ({
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

  const handleDocenteChange = (e) => {
    setDocenteId(e.target.value);
  };

  const handleAulaToggle = (aulaId) => {
    setAulasIds(prev => 
      prev.includes(aulaId)
        ? prev.filter(id => id !== aulaId)
        : [...prev, aulaId]
    );
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!actividadData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!actividadData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (!actividadData.cuento_id_cuento) {
      newErrors.cuento_id_cuento = 'Debe seleccionar un cuento';
    }

    if (actividadData.fecha_entrega && new Date(actividadData.fecha_entrega) < new Date()) {
      newErrors.fecha_entrega = 'La fecha de entrega no puede ser anterior a hoy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    // Paso 2 es opcional, no requiere validación
    return true;
  };

  const validateStep3 = () => {
    // Paso 3 es opcional, no requiere validación
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }

      setLoading(true);
      try {
        const data = {
          descripcion: actividadData.descripcion,
          tipo: actividadData.tipo,
          fecha_entrega: actividadData.fecha_entrega || null,
          cuento_id_cuento: parseInt(actividadData.cuento_id_cuento)
        };

        const response = await crearActividad(data);
        setActividadId(response.actividad.id_actividad);
        setCurrentStep(2);
      } catch (error) {
        console.error('Error creando actividad:', error);
        setErrors({ submit: 'Error al crear la actividad. Inténtalo de nuevo.' });
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Asignar docente si se seleccionó
      if (docenteId) {
        await asignarDocente(actividadId, parseInt(docenteId));
      }

      // Asignar aulas si se seleccionaron
      if (aulasIds.length > 0) {
        await asignarActividadAulas(actividadId, aulasIds);
      }

      onSuccess();
      onClose();
      resetWizard();
    } catch (error) {
      console.error('Error completando actividad:', error);
      setErrors({ submit: 'Error al completar la actividad. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container create-actividad-wizard">
        <div className="modal-header">
          <h2 className="modal-title">
            <FaClipboardList className="modal-icon" />
            Crear Nueva Actividad
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="wizard-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-title">Actividad + Cuento</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-title">Asignar Docente</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-title">Asignar Aulas</div>
          </div>
        </div>

        <div className="wizard-content">
          {/* Paso 1: Crear Actividad con Cuento */}
          {currentStep === 1 && (
            <div className="wizard-step">
              <h3 className="step-header">
                <FaClipboardList className="step-icon" />
                Crear Actividad con Cuento
              </h3>
              
              <div className="form-layout">
                <div className="form-group">
                  <label htmlFor="cuento_id_cuento" className="form-label">
                    <FaBook className="label-icon" />
                    Cuento Relacionado *
                  </label>
                  <select
                    id="cuento_id_cuento"
                    name="cuento_id_cuento"
                    value={actividadData.cuento_id_cuento}
                    onChange={handleActividadDataChange}
                    className={`form-select ${errors.cuento_id_cuento ? 'error' : ''}`}
                  >
                    <option value="">Seleccionar cuento...</option>
                    {cuentos.map(cuento => (
                      <option key={cuento.id_cuento} value={cuento.id_cuento}>
                        {cuento.titulo}
                      </option>
                    ))}
                  </select>
                  {errors.cuento_id_cuento && <span className="error-message">{errors.cuento_id_cuento}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="descripcion" className="form-label">
                    <FaClipboardList className="label-icon" />
                    Descripción de la Actividad *
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={actividadData.descripcion}
                    onChange={handleActividadDataChange}
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
                    value={actividadData.tipo}
                    onChange={handleActividadDataChange}
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
                    value={actividadData.fecha_entrega}
                    onChange={handleActividadDataChange}
                    className={`form-input ${errors.fecha_entrega ? 'error' : ''}`}
                  />
                  {errors.fecha_entrega && <span className="error-message">{errors.fecha_entrega}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Asignar Docente */}
          {currentStep === 2 && (
            <div className="wizard-step">
              <h3 className="step-header">
                <FaUser className="step-icon" />
                Asignar Docente (Opcional)
              </h3>
              
              <div className="step-info">
                <p className="info-text">
                  La actividad ya fue creada con el cuento seleccionado. Ahora puedes asignar un docente responsable.
                </p>
              </div>

              <div className="form-layout">
                <div className="form-group">
                  <label htmlFor="docente_id_docente" className="form-label">
                    <FaUser className="label-icon" />
                    Docente Responsable
                  </label>
                  <select
                    id="docente_id_docente"
                    name="docente_id_docente"
                    value={docenteId}
                    onChange={handleDocenteChange}
                    className="form-select"
                  >
                    <option value="">Seleccionar docente...</option>
                    {docentes.map(docente => (
                      <option key={docente.id_docente} value={docente.id_docente}>
                        {docente.nombre} {docente.apellido}
                      </option>
                    ))}
                  </select>
                  <p className="help-text">Puedes omitir este paso y asignar el docente más tarde.</p>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Asignar Aulas */}
          {currentStep === 3 && (
            <div className="wizard-step">
              <h3 className="step-header">
                <FaUsers className="step-icon" />
                Asignar Aulas (Opcional)
              </h3>
              
              <div className="step-info">
                <p className="info-text">
                  Selecciona las aulas donde estará disponible esta actividad.
                </p>
              </div>

              <div className="form-layout">
                <div className="form-group">
                  <label className="form-label">
                    <FaUsers className="label-icon" />
                    Aulas Asignadas
                  </label>
                  <div className="aulas-selection">
                    <div className="aulas-grid">
                      {aulas.map(aula => (
                        <div
                          key={aula.id_aula}
                          className={`aula-item ${aulasIds.includes(aula.id_aula) ? 'selected' : ''}`}
                          onClick={() => handleAulaToggle(aula.id_aula)}
                        >
                          <div className="aula-checkbox">
                            {aulasIds.includes(aula.id_aula) && <FaCheck className="check-icon" />}
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
                    <p className="help-text">Puedes omitir este paso y asignar las aulas más tarde.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="wizard-actions">
          <div className="wizard-buttons">
            {currentStep > 1 && (
              <button type="button" className="btn-secondary" onClick={handleBack}>
                <FaArrowLeft className="btn-icon" />
                Anterior
              </button>
            )}
            
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Siguiente'}
                <FaArrowRight className="btn-icon" />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleFinish}
                disabled={loading}
              >
                <FaCheck className="btn-icon" />
                {loading ? 'Completando...' : 'Finalizar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateActividadWizard;
