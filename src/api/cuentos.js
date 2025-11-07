import api from "./client";

/**
 * Obtener todos los cuentos con filtros opcionales
 * @param {Object} params - Parámetros de filtrado
 * @param {number} params.page - Número de página
 * @param {number} params.limit - Límite de resultados por página
 * @param {string} params.categoria - Filtrar por categoría
 * @param {string} params.edad - Filtrar por edad
 * @param {string} params.busqueda - Búsqueda por título
 */
export async function obtenerCuentos(params = {}) {
  try {
    const response = await api.get("/cuentos", { params });
    // El backend devuelve {ok: true, data: Array(7)}
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener cuentos:", error);
    throw error;
  }
}

/**
 * Obtener cuento por ID
 */
export async function obtenerCuentoPorId(id) {
  try {
    const response = await api.get(`/cuentos/${id}`);
    // El backend devuelve {ok: true, data: {...}}
    return response.data.data || response.data;
  } catch (error) {
    console.error(`Error al obtener cuento ${id}:`, error);
    throw error;
  }
}

/**
 * Crear nuevo cuento
 */
export async function crearCuento(data) {
  try {
    const payload = {
      ...data,
      edad_publico: data?.edad_publico != null ? Number(data.edad_publico) : data?.edad_publico,
      autor_id_autor: data?.autor_id_autor != null ? Number(data.autor_id_autor) : data?.autor_id_autor,
      genero_id_genero: data?.genero_id_genero != null ? Number(data.genero_id_genero) : data?.genero_id_genero,
    };
    const response = await api.post("/cuentos", payload);
    // El backend devuelve {ok: true, data: {...}}
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al crear cuento:", error);
    throw error;
  }
}

/**
 * Actualizar cuento
 */
export async function actualizarCuento(id, data) {
  try {
    const payload = {
      ...data,
      edad_publico: data?.edad_publico != null ? Number(data.edad_publico) : data?.edad_publico,
      autor_id_autor: data?.autor_id_autor != null ? Number(data.autor_id_autor) : data?.autor_id_autor,
      genero_id_genero: data?.genero_id_genero != null ? Number(data.genero_id_genero) : data?.genero_id_genero,
    };
    const response = await api.put(`/cuentos/${id}`, payload);
    // El backend devuelve {ok: true, data: {...}}
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al actualizar cuento:", error);
    throw error;
  }
}

/**
 * Eliminar cuento
 */
export async function eliminarCuento(id) {
  try {
    const response = await api.delete(`/cuentos/${id}`);
    // El backend devuelve {ok: true, data: {...}}
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al eliminar cuento:", error);
    throw error;
  }
}

/**
 * Obtener categorías de cuentos
 */
export async function obtenerCategorias() {
  try {
    const response = await api.get("/cuentos/categorias");
    return response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}

/**
 * Obtener total de cuentos
 */
export async function obtenerTotalCuentos() {
  try {
    const response = await api.get("/cuentos/estadisticas/total");
    // El backend devuelve {ok: true, data: {total: X}}
    return response.data.data?.total || response.data.total || 0;
  } catch (error) {
    console.error("Error al obtener total de cuentos:", error);
    return 0;
  }
}

/**
 * Editar cuento
 */
export async function editarCuento({ id, titulo, edad_publico, autor_id_autor, genero_id_genero, duracion, pdf_url, url_img }) {
  try {
    const response = await api.put(`/cuentos/${id}`, {
      titulo,
      edad_publico: edad_publico != null ? Number(edad_publico) : edad_publico,
      autor_id_autor: autor_id_autor != null ? Number(autor_id_autor) : autor_id_autor,
      genero_id_genero: genero_id_genero != null ? Number(genero_id_genero) : genero_id_genero,
      duracion,
      pdf_url,
      url_img
    });
    return response.data;
  } catch (error) {
    console.error("Error al editar cuento:", error);
    throw error;
  }
}

/**
 * Subir PDF de cuento (versión 2)
 */
export async function subirPDFCuentoV2({ cuentoId, file }) {
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    const response = await api.post(`/cuentos/${cuentoId}/pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir PDF:", error);
    throw error;
  }
}

/**
 * Subir imagen de cuento
 */
export async function subirImagenCuento({ cuentoId, file }) {
  try {
    const formData = new FormData();
    formData.append('imagen', file);
    const response = await api.post(`/cuentos/${cuentoId}/imagen`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
}

/**
 * Crear cuento plano (sin estructura compleja)
 */
export async function crearCuentoPlano(data) {
  try {
    const payload = {
      ...data,
      edad_publico: data?.edad_publico != null ? Number(data.edad_publico) : data?.edad_publico,
      autor_id_autor: data?.autor_id_autor != null ? Number(data.autor_id_autor) : data?.autor_id_autor,
      genero_id_genero: data?.genero_id_genero != null ? Number(data.genero_id_genero) : data?.genero_id_genero,
    };
    const response = await api.post("/cuentos/plano", payload);
    return response.data;
  } catch (error) {
    console.error("Error al crear cuento plano:", error);
    throw error;
  }
}

/**
 * Listar cuentos con paginación
 */
export async function listarCuentos(params = {}) {
  try {
    const response = await api.get("/cuentos", { params });
    // El backend devuelve {ok: true, data: Array(7)}
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al listar cuentos:", error);
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 10
    };
  }
}

/**
 * Obtener todos los cuentos sin filtros
 */
export async function obtenerTodosLosCuentos() {
  try {
    const response = await api.get("/cuentos/todos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los cuentos:", error);
    return { data: [] };
  }
}

// Obtener cuentos públicos con filtros opcionales

export async function obtenerCuentosPublicos(params = {}) {
  try {
    const response = await api.get("/cuentos/publicos", { params });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener cuentos públicos:", error);
    throw error;
  }
}


//  Obtener un cuento público aleatorio para destacar
 
export async function obtenerCuentoDestacado() {
  try {
    const response = await api.get("/cuentos/publicos", { 
      params: { limite: 1 } 
    });
    
    const data = response.data.data || response.data;
    
    return data?.cuentos?.[0] || null;
  } catch (error) {
    console.error("Error al obtener cuento destacado:", error);
    return null;
  }
}

