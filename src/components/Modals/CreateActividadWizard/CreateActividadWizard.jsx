import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowLeft, FaArrowRight, FaCheck, FaCalendarAlt, FaClipboardList, FaBook, FaUser, FaUsers, FaPlus } from 'react-icons/fa';
import { crearActividadCompleta, asignarActividadAulas } from '../../../api/actividades';
import { obtenerTodosLosCuentos } from '../../../api/cuentos';
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

  // Paso 2: Crear preguntas y respuestas
  const [preguntas, setPreguntas] = useState([
    {
      enunciado: '',
      respuestas: [
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false }
      ]
    }
  ]);

  // Paso 3: Asignar aulas
  const [aulasIds, setAulasIds] = useState([]);

  // Datos para los dropdowns
  const [cuentos, setCuentos] = useState([]);
  const [aulas, setAulas] = useState([]);

  // ID de la actividad creada (para el paso 3)
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
    setPreguntas([
      {
        enunciado: '',
        respuestas: [
          { texto: '', es_correcta: false },
          { texto: '', es_correcta: false }
        ]
      }
    ]);
    setAulasIds([]);
    setActividadId(null);
    setErrors({});
  };

  const cargarDatos = async () => {
    try {
      const [cuentosData, aulasData] = await Promise.all([
        obtenerTodosLosCuentos(),
        listarAulas()
      ]);

      setCuentos(cuentosData.data || []);
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

  // Funciones para manejar preguntas y respuestas
  const handlePreguntaChange = (preguntaIndex, field, value) => {
    setPreguntas(prev => prev.map((pregunta, index) => 
      index === preguntaIndex 
        ? { ...pregunta, [field]: value }
        : pregunta
    ));
  };

  const handleRespuestaChange = (preguntaIndex, respuestaIndex, field, value) => {
    setPreguntas(prev => prev.map((pregunta, index) => 
      index === preguntaIndex 
        ? {
            ...pregunta,
            respuestas: pregunta.respuestas.map((respuesta, respIndex) => 
              respIndex === respuestaIndex 
                ? { ...respuesta, [field]: value }
                : respuesta
            )
          }
        : pregunta
    ));
  };

  const addPregunta = () => {
    setPreguntas(prev => [...prev, {
      enunciado: '',
      respuestas: [
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false }
      ]
    }]);
  };

  const removePregunta = (preguntaIndex) => {
    if (preguntas.length > 1) {
      setPreguntas(prev => prev.filter((_, index) => index !== preguntaIndex));
    }
  };

  const addRespuesta = (preguntaIndex) => {
    setPreguntas(prev => prev.map((pregunta, index) => 
      index === preguntaIndex 
        ? {
            ...pregunta,
            respuestas: [...pregunta.respuestas, { texto: '', es_correcta: false }]
          }
        : pregunta
    ));
  };

  const removeRespuesta = (preguntaIndex, respuestaIndex) => {
    setPreguntas(prev => prev.map((pregunta, index) => 
      index === preguntaIndex 
        ? {
            ...pregunta,
            respuestas: pregunta.respuestas.filter((_, respIndex) => respIndex !== respuestaIndex)
          }
        : pregunta
    ));
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
    const newErrors = {};

    // Validar que haya al menos una pregunta
    if (preguntas.length === 0) {
      newErrors.preguntas = 'Debe crear al menos una pregunta';
      setErrors(newErrors);
      return false;
    }

    // Validar cada pregunta
    for (let i = 0; i < preguntas.length; i++) {
      const pregunta = preguntas[i];
      
      if (!pregunta.enunciado.trim()) {
        newErrors[`pregunta_${i}_enunciado`] = 'El enunciado de la pregunta es requerido';
      }

      // Validación diferenciada por tipo de actividad
      if (actividadData.tipo === 'multiple_choice') {
        // Para opción múltiple: respuestas obligatorias con al menos una correcta
        if (pregunta.respuestas.length === 0) {
          newErrors[`pregunta_${i}_respuestas`] = 'Las actividades de opción múltiple requieren respuestas';
        } else if (pregunta.respuestas.length < 2) {
          newErrors[`pregunta_${i}_respuestas`] = 'Debe tener al menos 2 respuestas';
        } else {
          const tieneRespuestaCorrecta = pregunta.respuestas.some(resp => resp.es_correcta);
          if (!tieneRespuestaCorrecta) {
            newErrors[`pregunta_${i}_correcta`] = 'Debe tener al menos una respuesta correcta';
          }
        }
      } else if (actividadData.tipo === 'respuesta_abierta') {
        // Para respuesta abierta: respuestas opcionales, solo ejemplos (es_correcta: false)
        if (pregunta.respuestas.length > 0) {
          const tieneRespuestaCorrecta = pregunta.respuestas.some(resp => resp.es_correcta);
          if (tieneRespuestaCorrecta) {
            newErrors[`pregunta_${i}_correcta`] = 'Las actividades de respuesta abierta no pueden tener respuestas correctas';
          }
        }
      }

      // Validar que todas las respuestas tengan texto
      pregunta.respuestas.forEach((respuesta, respIndex) => {
        if (!respuesta.texto.trim()) {
          newErrors[`pregunta_${i}_respuesta_${respIndex}`] = 'El texto de la respuesta es requerido';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Crear actividad completa con preguntas y respuestas
      const data = {
        fecha_entrega: actividadData.fecha_entrega || null,
        descripcion: actividadData.descripcion,
        tipo: actividadData.tipo,
        cuento_id_cuento: parseInt(actividadData.cuento_id_cuento),
        preguntas: preguntas.map(pregunta => ({
          enunciado: pregunta.enunciado,
          respuestas: pregunta.respuestas.map(respuesta => ({
            respuesta: respuesta.texto,
            es_correcta: respuesta.es_correcta
          }))
        }))
      };

      const response = await crearActividadCompleta(data);
      setActividadId(response.actividad.id_actividad);

      // Asignar aulas si se seleccionaron (el docente se asigna automáticamente a través del aula)
      if (aulasIds.length > 0) {
        await asignarActividadAulas(response.actividad.id_actividad, aulasIds);
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
            <div className="step-title">Preguntas + Respuestas</div>
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

          {/* Paso 2: Crear Preguntas y Respuestas */}
          {currentStep === 2 && (
            <div className="wizard-step">
              <h3 className="step-header">
                <FaClipboardList className="step-icon" />
                Crear Preguntas y Respuestas
              </h3>
              
              <div className="step-info">
                <div className="tipo-indicator">
                  <span className={`tipo-badge ${actividadData.tipo === 'multiple_choice' ? 'multiple-choice' : 'respuesta-abierta'}`}>
                    {actividadData.tipo === 'multiple_choice' ? 'Opción Múltiple' : 'Respuesta Abierta'}
                  </span>
                </div>
                <p className="info-text">
                  {actividadData.tipo === 'multiple_choice' 
                    ? 'Crea las preguntas y respuestas para tu actividad. Marca al menos una respuesta correcta por pregunta.'
                    : 'Crea las preguntas para tu actividad. Las respuestas son opcionales y solo sirven como ejemplos.'
                  }
                </p>
              </div>

              <div className="form-layout">
                {preguntas.map((pregunta, preguntaIndex) => (
                  <div key={preguntaIndex} className="pregunta-container">
                    <div className="pregunta-header">
                      <h4 className="pregunta-title">Pregunta {preguntaIndex + 1}</h4>
                      {preguntas.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-remove-pregunta"
                          onClick={() => removePregunta(preguntaIndex)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <FaClipboardList className="label-icon" />
                        Enunciado de la Pregunta *
                      </label>
                      <textarea
                        value={pregunta.enunciado}
                        onChange={(e) => handlePreguntaChange(preguntaIndex, 'enunciado', e.target.value)}
                        className={`form-textarea ${errors[`pregunta_${preguntaIndex}_enunciado`] ? 'error' : ''}`}
                        placeholder="Escribe la pregunta aquí..."
                        rows="3"
                      />
                      {errors[`pregunta_${preguntaIndex}_enunciado`] && (
                        <span className="error-message">{errors[`pregunta_${preguntaIndex}_enunciado`]}</span>
                      )}
                    </div>

                    <div className="respuestas-container">
                      <div className="respuestas-header">
                        <label className="form-label">
                          <FaCheck className="label-icon" />
                          {actividadData.tipo === 'multiple_choice' ? 'Respuestas *' : 'Respuestas de Ejemplo (Opcional)'}
                        </label>
                        <button 
                          type="button" 
                          className="btn-add-respuesta"
                          onClick={() => addRespuesta(preguntaIndex)}
                        >
                          <FaPlus /> {actividadData.tipo === 'multiple_choice' ? 'Agregar Respuesta' : 'Agregar Ejemplo'}
                        </button>
                      </div>

                      {pregunta.respuestas.map((respuesta, respuestaIndex) => (
                        <div key={respuestaIndex} className="respuesta-item">
                          <div className="respuesta-input">
                            <input
                              type="text"
                              value={respuesta.texto}
                              onChange={(e) => handleRespuestaChange(preguntaIndex, respuestaIndex, 'texto', e.target.value)}
                              className={`form-input ${errors[`pregunta_${preguntaIndex}_respuesta_${respuestaIndex}`] ? 'error' : ''}`}
                              placeholder={`Respuesta ${respuestaIndex + 1}...`}
                            />
                            {pregunta.respuestas.length > 2 && (
                              <button 
                                type="button" 
                                className="btn-remove-respuesta"
                                onClick={() => removeRespuesta(preguntaIndex, respuestaIndex)}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                          {actividadData.tipo === 'multiple_choice' && (
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                checked={respuesta.es_correcta}
                                onChange={(e) => handleRespuestaChange(preguntaIndex, respuestaIndex, 'es_correcta', e.target.checked)}
                              />
                              <span className="checkbox-label">Correcta</span>
                            </label>
                          )}
                          {actividadData.tipo === 'respuesta_abierta' && (
                            <span className="ejemplo-label">Ejemplo</span>
                          )}
                        </div>
                      ))}

                      {errors[`pregunta_${preguntaIndex}_respuestas`] && (
                        <span className="error-message">{errors[`pregunta_${preguntaIndex}_respuestas`]}</span>
                      )}
                      {errors[`pregunta_${preguntaIndex}_correcta`] && (
                        <span className="error-message">{errors[`pregunta_${preguntaIndex}_correcta`]}</span>
                      )}
                    </div>
                  </div>
                ))}

                <div className="add-pregunta-container">
                  <button 
                    type="button" 
                    className="btn-add-pregunta"
                    onClick={addPregunta}
                  >
                    <FaPlus className="btn-icon" />
                    Agregar Pregunta
                  </button>
                </div>

                {errors.preguntas && (
                  <span className="error-message">{errors.preguntas}</span>
                )}
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
                  Selecciona las aulas donde estará disponible esta actividad. El docente se asignará automáticamente a través del aula.
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
                            <div className="aula-name">{aula.nombre_aula}</div>
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
