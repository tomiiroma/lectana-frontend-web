import api from './client';

// Crear actividad con cuento (Paso 1)
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

// Asignar docente a una actividad (Paso 2)
export const asignarDocente = async (actividadId, docenteId) => {
  try {
    const response = await api.put(`/actividades/${actividadId}/docente`, {
      docente_id_docente: docenteId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

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

// Función helper para crear actividad completa en un solo paso
export const crearActividadCompleta = async (actividadData, cuentoId, docenteId, aulasIds) => {
  try {
    // 1. Crear actividad básica
    const actividadBasica = await crearActividadBasica(actividadData);
    
    // 2. Asignar cuento y docente si se proporcionan
    if (cuentoId || docenteId) {
      await asignarCuentoDocente(actividadBasica.actividad.id_actividad, {
        cuento_id_cuento: cuentoId,
        docente_id_docente: docenteId
      });
    }
    
    // 3. Asignar a aulas si se proporcionan
    if (aulasIds && aulasIds.length > 0) {
      await asignarActividadAulas(actividadBasica.actividad.id_actividad, aulasIds);
    }
    
    return actividadBasica.actividad;
  } catch (error) {
    throw error;
  }
};
