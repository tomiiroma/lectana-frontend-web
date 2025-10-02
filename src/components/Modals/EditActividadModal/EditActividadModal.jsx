import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaCalendarAlt, FaBook, FaClipboardList, FaSave, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import { editarActividadCompleta, obtenerActividadPorId, agregarPreguntaAActividad, editarPreguntaCompleta, eliminarPregunta } from '../../../api/actividades';
import { obtenerTodosLosCuentos } from '../../../api/cuentos';
import './EditActividadModal.css';

const EditActividadModal = ({ isOpen, onClose, actividadId, onSuccess }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    tipo: 'multiple_choice',
    fecha_entrega: '',
    cuento_id_cuento: ''
  });

  const [preguntas, setPreguntas] = useState([]);
  const [cuentos, setCuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingPregunta, setEditingPregunta] = useState(null);
  const [showAddPregunta, setShowAddPregunta] = useState(false);

  useEffect(() => {
    if (isOpen && actividadId) {
      cargarDatos();
    }
  }, [isOpen, actividadId]);

  const cargarDatos = async () => {
    setLoadingData(true);
    try {
      const [actividadData, cuentosData] = await Promise.all([
        obtenerActividadPorId(actividadId),
        obtenerTodosLosCuentos()
      ]);

      const actividad = actividadData.actividad;
      
      setFormData({
        descripcion: actividad.descripcion || '',
        tipo: actividad.tipo || 'multiple_choice',
        fecha_entrega: actividad.fecha_entrega 
          ? new Date(actividad.fecha_entrega).toISOString().slice(0, 16)
          : '',
        cuento_id_cuento: actividad.cuento_id_cuento || ''
      });

      // Cargar preguntas existentes
      setPreguntas(actividad.pregunta_actividad || []);

      setCuentos(cuentosData.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setErrors({ submit: 'Error al cargar los datos de la actividad.' });
    } finally {
      setLoadingData(false);
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

  // Funciones para manejar preguntas
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
            respuesta_actividad: pregunta.respuesta_actividad.map((respuesta, respIndex) => 
              respIndex === respuestaIndex 
                ? { ...respuesta, [field]: value }
                : respuesta
            )
          }
        : pregunta
    ));
  };

  const addPregunta = () => {
    setShowAddPregunta(true);
    setEditingPregunta({
      enunciado: '',
      respuestas: [
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false }
      ]
    });
  };

  const saveNewPregunta = async () => {
    if (!editingPregunta.enunciado.trim()) {
      setErrors({ pregunta: 'El enunciado es requerido' });
      return;
    }

    // Validación diferenciada por tipo de actividad
    if (formData.tipo === 'multiple_choice') {
      if (editingPregunta.respuestas.length === 0) {
        setErrors({ pregunta: 'Las actividades de opción múltiple requieren respuestas' });
        return;
      } else if (editingPregunta.respuestas.length < 2) {
        setErrors({ pregunta: 'Debe tener al menos 2 respuestas' });
        return;
      }
      
      const tieneRespuestaCorrecta = editingPregunta.respuestas.some(resp => resp.es_correcta);
      if (!tieneRespuestaCorrecta) {
        setErrors({ pregunta: 'Debe tener al menos una respuesta correcta' });
        return;
      }
    } else if (formData.tipo === 'respuesta_abierta') {
      if (editingPregunta.respuestas.length > 0) {
        const tieneRespuestaCorrecta = editingPregunta.respuestas.some(resp => resp.es_correcta);
        if (tieneRespuestaCorrecta) {
          setErrors({ pregunta: 'Las actividades de respuesta abierta no pueden tener respuestas correctas' });
          return;
        }
      }
    }

    try {
      const preguntaData = {
        actividad_id_actividad: actividadId,
        enunciado: editingPregunta.enunciado,
        respuestas: editingPregunta.respuestas.map(respuesta => ({
          respuesta: respuesta.texto,
          es_correcta: respuesta.es_correcta
        }))
      };

      const response = await agregarPreguntaAActividad(preguntaData);
      setPreguntas(prev => [...prev, response.pregunta]);
      setShowAddPregunta(false);
      setEditingPregunta(null);
      setErrors({});
    } catch (error) {
      console.error('Error agregando pregunta:', error);
      setErrors({ pregunta: 'Error al agregar la pregunta' });
    }
  };

  const editPregunta = (preguntaIndex) => {
    const pregunta = preguntas[preguntaIndex];
    setEditingPregunta({
      id: pregunta.id_pregunta_actividad,
      enunciado: pregunta.enunciado,
      respuestas: pregunta.respuesta_actividad.map(resp => ({
        texto: resp.respuesta,
        es_correcta: resp.es_correcta
      }))
    });
    setShowAddPregunta(true);
  };

  const saveEditedPregunta = async () => {
    if (!editingPregunta.enunciado.trim()) {
      setErrors({ pregunta: 'El enunciado es requerido' });
      return;
    }

    // Validación diferenciada por tipo de actividad
    if (formData.tipo === 'multiple_choice') {
      if (editingPregunta.respuestas.length === 0) {
        setErrors({ pregunta: 'Las actividades de opción múltiple requieren respuestas' });
        return;
      } else if (editingPregunta.respuestas.length < 2) {
        setErrors({ pregunta: 'Debe tener al menos 2 respuestas' });
        return;
      }
      
      const tieneRespuestaCorrecta = editingPregunta.respuestas.some(resp => resp.es_correcta);
      if (!tieneRespuestaCorrecta) {
        setErrors({ pregunta: 'Debe tener al menos una respuesta correcta' });
        return;
      }
    } else if (formData.tipo === 'respuesta_abierta') {
      if (editingPregunta.respuestas.length > 0) {
        const tieneRespuestaCorrecta = editingPregunta.respuestas.some(resp => resp.es_correcta);
        if (tieneRespuestaCorrecta) {
          setErrors({ pregunta: 'Las actividades de respuesta abierta no pueden tener respuestas correctas' });
          return;
        }
      }
    }

    try {
      const preguntaData = {
        enunciado: editingPregunta.enunciado,
        respuestas: editingPregunta.respuestas.map(respuesta => ({
          respuesta: respuesta.texto,
          es_correcta: respuesta.es_correcta
        }))
      };

      const response = await editarPreguntaCompleta(editingPregunta.id, preguntaData);
      
      // Actualizar la pregunta en el estado
      setPreguntas(prev => prev.map((pregunta, index) => 
        pregunta.id_pregunta_actividad === editingPregunta.id 
          ? response.pregunta 
          : pregunta
      ));

      setShowAddPregunta(false);
      setEditingPregunta(null);
      setErrors({});
    } catch (error) {
      console.error('Error editando pregunta:', error);
      setErrors({ pregunta: 'Error al editar la pregunta' });
    }
  };

  const deletePregunta = async (preguntaId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      return;
    }

    try {
      await eliminarPregunta(preguntaId);
      setPreguntas(prev => prev.filter(p => p.id_pregunta_actividad !== preguntaId));
    } catch (error) {
      console.error('Error eliminando pregunta:', error);
      setErrors({ submit: 'Error al eliminar la pregunta' });
    }
  };

  const handleNewPreguntaChange = (field, value) => {
    setEditingPregunta(prev => ({ ...prev, [field]: value }));
  };

  const handleNewRespuestaChange = (respuestaIndex, field, value) => {
    setEditingPregunta(prev => ({
      ...prev,
      respuestas: prev.respuestas.map((respuesta, index) => 
        index === respuestaIndex 
          ? { ...respuesta, [field]: value }
          : respuesta
      )
    }));
  };

  const addNewRespuesta = () => {
    setEditingPregunta(prev => ({
      ...prev,
      respuestas: [...prev.respuestas, { texto: '', es_correcta: false }]
    }));
  };

  const removeNewRespuesta = (respuestaIndex) => {
    setEditingPregunta(prev => ({
      ...prev,
      respuestas: prev.respuestas.filter((_, index) => index !== respuestaIndex)
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
        fecha_entrega: formData.fecha_entrega || null,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        cuento_id_cuento: formData.cuento_id_cuento ? parseInt(formData.cuento_id_cuento) : null,
        preguntas: preguntas.map(pregunta => ({
          enunciado: pregunta.enunciado,
          respuestas: pregunta.respuesta_actividad.map(respuesta => ({
            respuesta: respuesta.respuesta,
            es_correcta: respuesta.es_correcta
          }))
        }))
      };

      await editarActividadCompleta(actividadId, actividadData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error actualizando actividad:', error);
      setErrors({ submit: 'Error al actualizar la actividad. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      descripcion: '',
      tipo: 'multiple_choice',
      fecha_entrega: '',
      cuento_id_cuento: ''
    });
    setPreguntas([]);
    setEditingPregunta(null);
    setShowAddPregunta(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container edit-actividad-modal">
        <div className="modal-header">
          <h2 className="modal-title">
            <FaClipboardList className="modal-icon" />
            Editar Actividad Completa
          </h2>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {loadingData ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando datos de la actividad...</p>
          </div>
        ) : (
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
                  <option value="">Sin cuento asignado</option>
                  {cuentos.map(cuento => (
                    <option key={cuento.id_cuento} value={cuento.id_cuento}>
                      {cuento.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3 className="section-title">Preguntas y Respuestas</h3>
                <div className="tipo-indicator">
                  <span className={`tipo-badge ${formData.tipo === 'multiple_choice' ? 'multiple-choice' : 'respuesta-abierta'}`}>
                    {formData.tipo === 'multiple_choice' ? 'Opción Múltiple' : 'Respuesta Abierta'}
                  </span>
                </div>
                <button 
                  type="button" 
                  className="btn-add-pregunta"
                  onClick={addPregunta}
                >
                  <FaPlus className="btn-icon" />
                  Agregar Pregunta
                </button>
              </div>

              {preguntas.map((pregunta, preguntaIndex) => (
                <div key={pregunta.id_pregunta_actividad} className="pregunta-container">
                  <div className="pregunta-header">
                    <h4 className="pregunta-title">Pregunta {preguntaIndex + 1}</h4>
                    <div className="pregunta-actions">
                      <button 
                        type="button" 
                        className="btn-edit-pregunta"
                        onClick={() => editPregunta(preguntaIndex)}
                        title="Editar pregunta"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        type="button" 
                        className="btn-delete-pregunta"
                        onClick={() => deletePregunta(pregunta.id_pregunta_actividad)}
                        title="Eliminar pregunta"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="pregunta-content">
                    <p className="pregunta-enunciado">{pregunta.enunciado}</p>
                    <div className="respuestas-list">
                      {pregunta.respuesta_actividad.map((respuesta, respuestaIndex) => (
                        <div key={respuesta.id_respuesta_actividad} className="respuesta-item">
                          <span className={`respuesta-text ${respuesta.es_correcta ? 'correcta' : ''}`}>
                            {respuesta.respuesta}
                          </span>
                          {respuesta.es_correcta && (
                            <FaCheck className="respuesta-correcta-icon" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {preguntas.length === 0 && (
                <div className="no-preguntas">
                  <p>No hay preguntas creadas aún.</p>
                  <button 
                    type="button" 
                    className="btn-add-first-pregunta"
                    onClick={addPregunta}
                  >
                    <FaPlus className="btn-icon" />
                    Crear Primera Pregunta
                  </button>
                </div>
              )}
            </div>

            {/* Modal para agregar/editar pregunta */}
            {showAddPregunta && (
              <div className="pregunta-modal-overlay">
                <div className="pregunta-modal">
                  <div className="pregunta-modal-header">
                    <h4>{editingPregunta?.id ? 'Editar Pregunta' : 'Agregar Nueva Pregunta'}</h4>
                    <button 
                      type="button" 
                      className="btn-close-modal"
                      onClick={() => {
                        setShowAddPregunta(false);
                        setEditingPregunta(null);
                        setErrors({});
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="pregunta-modal-content">
                    <div className="form-group">
                      <label className="form-label">Enunciado de la Pregunta *</label>
                      <textarea
                        value={editingPregunta?.enunciado || ''}
                        onChange={(e) => handleNewPreguntaChange('enunciado', e.target.value)}
                        className="form-textarea"
                        placeholder="Escribe la pregunta aquí..."
                        rows="3"
                      />
                    </div>

                    <div className="respuestas-section">
                      <div className="respuestas-header">
                        <label className="form-label">Respuestas *</label>
                        <button 
                          type="button" 
                          className="btn-add-respuesta"
                          onClick={addNewRespuesta}
                        >
                          <FaPlus /> Agregar Respuesta
                        </button>
                      </div>

                      {editingPregunta?.respuestas.map((respuesta, respuestaIndex) => (
                        <div key={respuestaIndex} className="respuesta-item">
                          <div className="respuesta-input">
                            <input
                              type="text"
                              value={respuesta.texto}
                              onChange={(e) => handleNewRespuestaChange(respuestaIndex, 'texto', e.target.value)}
                              className="form-input"
                              placeholder={`Respuesta ${respuestaIndex + 1}...`}
                            />
                            {editingPregunta.respuestas.length > 2 && (
                              <button 
                                type="button" 
                                className="btn-remove-respuesta"
                                onClick={() => removeNewRespuesta(respuestaIndex)}
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                          <label className="checkbox-container">
                            <input
                              type="checkbox"
                              checked={respuesta.es_correcta}
                              onChange={(e) => handleNewRespuestaChange(respuestaIndex, 'es_correcta', e.target.checked)}
                            />
                            <span className="checkbox-label">Correcta</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {errors.pregunta && (
                      <span className="error-message">{errors.pregunta}</span>
                    )}
                  </div>

                  <div className="pregunta-modal-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => {
                        setShowAddPregunta(false);
                        setEditingPregunta(null);
                        setErrors({});
                      }}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn-primary"
                      onClick={editingPregunta?.id ? saveEditedPregunta : saveNewPregunta}
                    >
                      <FaSave className="btn-icon" />
                      {editingPregunta?.id ? 'Actualizar' : 'Agregar'} Pregunta
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                <FaSave className="btn-icon" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditActividadModal;