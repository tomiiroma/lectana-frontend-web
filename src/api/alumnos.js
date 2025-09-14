import api from "./client";

// Obtener lista de alumnos con paginación y filtros
export async function obtenerAlumnos({ page = 1, limit = 10, q = "", aula_id = null } = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (q) params.append('q', q);
    if (aula_id) params.append('aula_id', aula_id.toString());
    
    const { data } = await api.get(`/alumnos/admin-listar-alumnos?${params.toString()}`);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo alumnos");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerAlumnos:", error);
    throw error;
  }
}

// Obtener alumno específico por ID
export async function obtenerAlumnoPorId(id) {
  try {
    const { data } = await api.get(`/alumnos/admin-obtener-alumno/${id}`);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo alumno");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error en obtenerAlumnoPorId:", error);
    throw error;
  }
}
