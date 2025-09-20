import api from './client';

// Crear actividad completa con preguntas y respuestas (RECOMENDADO)
export const crearActividadCompleta = async (actividadData) => {
  try {
    const response = await api.post('/actividades/completa', actividadData);
    return response.data;
  } catch (error) {
    // Manejo específico de errores de validación diferenciada
    if (error.response?.status === 400 && error.response?.data?.error) {
      const errorMessage = error.response.data.error;
      
      // Errores específicos del backend para validaciones diferenciadas
      if (errorMessage.includes('debe tener al menos una respuesta para actividades de opción múltiple')) {
        throw new Error('Las actividades de opción múltiple requieren respuestas para todas las preguntas');
      }
      if (errorMessage.includes('debe tener al menos una respuesta correcta')) {
        throw new Error('Cada pregunta debe tener al menos una respuesta correcta');
      }
      if (errorMessage.includes('no puede tener respuestas marcadas como correctas en actividades de respuesta abierta')) {
        throw new Error('Las actividades de respuesta abierta no pueden tener respuestas correctas');
      }
      
      throw new Error(errorMessage);
    }
    
    throw error.response?.data || error;
  }
};

// Editar actividad completa con preguntas y respuestas (RECOMENDADO)
export const editarActividadCompleta = async (actividadId, actividadData) => {
  try {
    const response = await api.put(`/actividades/${actividadId}/completa`, actividadData);
    return response.data;
  } catch (error) {
    // Manejo específico de errores de validación diferenciada
    if (error.response?.status === 400 && error.response?.data?.error) {
      const errorMessage = error.response.data.error;
      
      // Errores específicos del backend para validaciones diferenciadas
      if (errorMessage.includes('debe tener al menos una respuesta para actividades de opción múltiple')) {
        throw new Error('Las actividades de opción múltiple requieren respuestas para todas las preguntas');
      }
      if (errorMessage.includes('debe tener al menos una respuesta correcta')) {
        throw new Error('Cada pregunta debe tener al menos una respuesta correcta');
      }
      if (errorMessage.includes('no puede tener respuestas marcadas como correctas en actividades de respuesta abierta')) {
        throw new Error('Las actividades de respuesta abierta no pueden tener respuestas correctas');
      }
      
      throw new Error(errorMessage);
    }
    
    throw error.response?.data || error;
  }
};

// Crear actividad básica (mantener para compatibilidad)
export const crearActividad = async (actividadData) => {
  try {
    const response = await api.post('/actividades', actividadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Crear actividad básica (mantener para compatibilidad)
export const crearActividadBasica = async (actividadData) => {
  try {
    const response = await api.post('/actividades/basica', actividadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Asignar cuento y docente a una actividad
export const asignarCuentoDocente = async (actividadId, { cuento_id_cuento, docente_id_docente }) => {
  try {
    const response = await api.put(`/actividades/${actividadId}/asignar`, {
      cuento_id_cuento,
      docente_id_docente
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener todas las actividades
export const obtenerActividades = async () => {
  try {
    const response = await api.get('/actividades');
    return response.data;
  } catch (error) {
    // Mejorar el manejo de errores
    if (error.response?.status === 500) {
      const errorData = error.response?.data;
      if (errorData?.error && errorData.error.includes('column')) {
        throw new Error(`Error de base de datos: ${errorData.error}`);
      } else {
        throw new Error('Error del servidor. Posiblemente no hay actividades creadas.');
      }
    } else if (error.response?.status === 404) {
      throw new Error('No se encontraron actividades.');
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      throw new Error('Error de conexión con el servidor.');
    } else {
      throw error.response?.data || error;
    }
  }
};

// Obtener actividad por ID
export const obtenerActividadPorId = async (actividadId) => {
  try {
    const response = await api.get(`/actividades/${actividadId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Actualizar actividad completa
export const actualizarActividad = async (actividadId, actividadData) => {
  try {
    const response = await api.put(`/actividades/${actividadId}`, actividadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Eliminar actividad
export const eliminarActividad = async (actividadId) => {
  try {
    const response = await api.delete(`/actividades/${actividadId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// NOTA: El endpoint de asignar docente fue eliminado del backend
// Ahora el docente se asigna automáticamente a través del aula

// Asignar actividad a múltiples aulas (Paso 3)
export const asignarActividadAulas = async (actividadId, aulasIds) => {
  try {
    const response = await api.put(`/actividades/${actividadId}/aulas`, {
      aulas: aulasIds
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener aulas asignadas a una actividad
export const obtenerAulasActividad = async (actividadId) => {
  try {
    const response = await api.get(`/actividades/${actividadId}/aulas`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Remover actividad de un aula específica
export const removerActividadDeAula = async (actividadId, aulaId) => {
  try {
    const response = await api.delete(`/actividades/${actividadId}/aulas/${aulaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener actividades de un aula específica
export const obtenerActividadesDeAula = async (aulaId) => {
  try {
    const response = await api.get(`/aulas/${aulaId}/actividades`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Agregar pregunta individual a actividad existente (RECOMENDADO)
export const agregarPreguntaAActividad = async (preguntaData) => {
  try {
    const response = await api.post('/preguntas/agregar', preguntaData);
    return response.data;
  } catch (error) {
    // Manejo específico de errores de validación diferenciada
    if (error.response?.status === 400 && error.response?.data?.error) {
      const errorMessage = error.response.data.error;
      
      // Errores específicos del backend para validaciones diferenciadas
      if (errorMessage.includes('debe tener al menos una respuesta para actividades de opción múltiple')) {
        throw new Error('Las actividades de opción múltiple requieren respuestas para todas las preguntas');
      }
      if (errorMessage.includes('debe tener al menos una respuesta correcta')) {
        throw new Error('Cada pregunta debe tener al menos una respuesta correcta');
      }
      if (errorMessage.includes('no puede tener respuestas marcadas como correctas en actividades de respuesta abierta')) {
        throw new Error('Las actividades de respuesta abierta no pueden tener respuestas correctas');
      }
      
      throw new Error(errorMessage);
    }
    
    throw error.response?.data || error;
  }
};

// Editar pregunta completa con respuestas (RECOMENDADO)
export const editarPreguntaCompleta = async (preguntaId, preguntaData) => {
  try {
    const response = await api.put(`/preguntas/${preguntaId}/completa`, preguntaData);
    return response.data;
  } catch (error) {
    // Manejo específico de errores de validación diferenciada
    if (error.response?.status === 400 && error.response?.data?.error) {
      const errorMessage = error.response.data.error;
      
      // Errores específicos del backend para validaciones diferenciadas
      if (errorMessage.includes('debe tener al menos una respuesta para actividades de opción múltiple')) {
        throw new Error('Las actividades de opción múltiple requieren respuestas para todas las preguntas');
      }
      if (errorMessage.includes('debe tener al menos una respuesta correcta')) {
        throw new Error('Cada pregunta debe tener al menos una respuesta correcta');
      }
      if (errorMessage.includes('no puede tener respuestas marcadas como correctas en actividades de respuesta abierta')) {
        throw new Error('Las actividades de respuesta abierta no pueden tener respuestas correctas');
      }
      
      throw new Error(errorMessage);
    }
    
    throw error.response?.data || error;
  }
};

// Editar solo enunciado de pregunta
export const editarPregunta = async (preguntaId, preguntaData) => {
  try {
    const response = await api.put(`/preguntas/${preguntaId}`, preguntaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Eliminar pregunta individual
export const eliminarPregunta = async (preguntaId) => {
  try {
    const response = await api.delete(`/preguntas/${preguntaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Eliminar todas las preguntas de una actividad
export const eliminarTodasLasPreguntas = async (actividadId) => {
  try {
    const response = await api.delete(`/preguntas/actividad/${actividadId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Crear múltiples preguntas para una actividad (LEGACY)
export const crearPreguntas = async (preguntasData) => {
  try {
    const response = await api.post('/preguntas/multiple', preguntasData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Crear múltiples respuestas para una pregunta
export const crearRespuestas = async (respuestasData) => {
  try {
    const response = await api.post('/respuestas/multiple', respuestasData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener preguntas de una actividad
export const obtenerPreguntasActividad = async (actividadId) => {
  try {
    const response = await api.get(`/preguntas/actividad/${actividadId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Obtener respuestas de una pregunta
export const obtenerRespuestasPregunta = async (preguntaId) => {
  try {
    const response = await api.get(`/respuestas/pregunta/${preguntaId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Función helper para crear actividad completa en un solo paso (LEGACY - usar crearActividadCompleta)
export const crearActividadCompletaLegacy = async (actividadData, cuentoId, aulasIds) => {
  try {
    // 1. Crear actividad básica
    const actividadBasica = await crearActividadBasica(actividadData);
    
    // 2. Asignar cuento si se proporciona
    if (cuentoId) {
      await asignarCuentoDocente(actividadBasica.actividad.id_actividad, {
        cuento_id_cuento: cuentoId,
        docente_id_docente: null // Ya no se asigna docente directamente
      });
    }
    
    // 3. Asignar a aulas si se proporcionan (el docente se asigna automáticamente a través del aula)
    if (aulasIds && aulasIds.length > 0) {
      await asignarActividadAulas(actividadBasica.actividad.id_actividad, aulasIds);
    }
    
    return actividadBasica.actividad;
  } catch (error) {
    throw error;
  }
};
