import api from "./client";

// Crear nuevo docente
export async function crearDocente({ nombre, apellido, email, edad, password, dni, institucion_nombre, institucion_pais, institucion_provincia, nivel_educativo, telefono = null }) {
  try {
    const { data } = await api.post("/docentes/crear-docente", {
      nombre,
      apellido,
      email,
      edad,
      password,
      dni,
      institucion_nombre,
      institucion_pais,
      institucion_provincia,
      nivel_educativo,
      telefono
    });
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando docente");
    }
    
    return data.data; // Retorna datos del docente creado
  } catch (error) {
    console.error("Error en crearDocente:", error);
    throw error;
  }
}

// Obtener lista de docentes con paginación y filtros
export async function obtenerDocentes({ page = 1, limit = 10, q = "", verificado = null } = {}) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (q) params.append('q', q);
    if (verificado !== null) params.append('verificado', verificado.toString());
    
    const { data } = await api.get(`/docentes/admin-listar-docentes?${params.toString()}`);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo docentes");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerDocentes:", error);
    throw error;
  }
}
