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
    return response.data;
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
    return response.data;
  } catch (error) {
    console.error("Error al obtener cuento:", error);
    throw error;
  }
}

/**
 * Crear nuevo cuento
 */
export async function crearCuento(data) {
  try {
    const response = await api.post("/cuentos", data);
    return response.data;
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
    const response = await api.put(`/cuentos/${id}`, data);
    return response.data;
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
    return response.data;
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

// Mock de obtener total de cuentos
export async function obtenerTotalCuentos() {
  console.log("MOCK: obtenerTotalCuentos");
  return 0;
}

// Mock de editar cuento
export async function editarCuento({ id, titulo, edad_publico, autor_id_autor, genero_id_genero, duracion, pdf_url, url_img }) {
  console.log("MOCK: editarCuento:", { id, titulo, edad_publico, autor_id_autor, genero_id_genero, duracion, pdf_url, url_img });
  return { id, titulo, edad_publico, autor_id_autor, genero_id_genero, duracion, pdf_url, url_img };
}

// Mock de subir PDF
export async function subirPDFCuentoV2({ cuentoId, file }) {
  console.log("MOCK: subirPDFCuentoV2:", { cuentoId, fileName: file?.name });
  return { url: "mock-pdf-url.pdf" };
}

// Mock de subir imagen
export async function subirImagenCuento({ cuentoId, file }) {
  console.log("MOCK: subirImagenCuento:", { cuentoId, fileName: file?.name });
  return { url: "mock-image-url.jpg" };
}


