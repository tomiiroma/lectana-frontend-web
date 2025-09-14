import api from "./client";

// Obtener lista de administradores con paginación y filtros
export async function obtenerAdministradores({ page = 1, limit = 10, q = "" } = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (q) params.append('q', q);
    
    const { data } = await api.get(`/administradores/admin-listar-administradores?${params.toString()}`);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo administradores");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerAdministradores:", error);
    throw error;
  }
}

// Obtener administrador específico por ID
export async function obtenerAdministradorPorId(id) {
  try {
    const { data } = await api.get(`/administradores/admin-obtener-administrador/${id}`);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo administrador");
    }
    
    return data.data;
  } catch (error) {
    console.error("Error en obtenerAdministradorPorId:", error);
    throw error;
  }
}
