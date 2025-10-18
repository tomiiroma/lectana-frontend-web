import api from "./client";

/**
 * Verificar si un cuento tiene audio
 * @param {number} cuentoId - ID del cuento
 * @returns {Promise<Object>} Estado del audio
 */
export async function verificarEstadoAudio(cuentoId) {
  try {
    const response = await api.get(`/audio/cuentos/${cuentoId}/audio/status`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al verificar estado del audio para cuento ${cuentoId}:`, error);
    throw error;
  }
}

/**
 * Obtener información del audio de un cuento
 * @param {number} cuentoId - ID del cuento
 * @returns {Promise<Object>} Información del audio
 */
export async function obtenerAudioInfo(cuentoId) {
  try {
    const response = await api.get(`/audio/cuentos/${cuentoId}/audio`);
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener información del audio para cuento ${cuentoId}:`, error);
    throw error;
  }
}

/**
 * Generar audio para un cuento (solo admin)
 * @param {number} cuentoId - ID del cuento
 * @returns {Promise<Object>} Resultado de la generación
 */
export async function generarAudio(cuentoId) {
  try {
    const response = await api.post(`/audio/cuentos/${cuentoId}/generate-audio`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al generar audio:", error);
    throw error;
  }
}

/**
 * Eliminar audio de un cuento (solo admin)
 * @param {number} cuentoId - ID del cuento
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function eliminarAudio(cuentoId) {
  try {
    const response = await api.delete(`/audio/cuentos/${cuentoId}/audio`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al eliminar audio:", error);
    throw error;
  }
}
