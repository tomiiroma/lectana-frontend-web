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

// Obtener docente específico por ID
export async function obtenerDocentePorId(id) {
  try {
    console.log(`🔄 Docente - Llamando a: /docentes/admin-obtener-docente/${id}`);
    const { data } = await api.get(`/docentes/admin-obtener-docente/${id}`);
    
    console.log('🔍 Docente - Respuesta completa:', data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo docente");
    }
    
    console.log('✅ Docente - Retornando datos:', data.data);
    // El backend devuelve los datos en data.data
    return data.data;
  } catch (error) {
    console.error("❌ Error en obtenerDocentePorId:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ URL:", error.config?.url);
    throw error;
  }
}

// Obtener lista de docentes con paginación y filtros (para usuarios.jsx)
export async function obtenerDocentes({ page = 1, limit = 10, q = "", verificado = null } = {}) {
  try {
    const params = { page, limit };
    if (q) params.q = q;
    if (verificado !== null) params.verificado = verificado;
    
    console.log("API obtenerDocentes - params enviados:", params);
    const { data } = await api.get("/docentes/admin-listar-docentes", { params });
    console.log("API obtenerDocentes - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo docentes");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerDocentes:", error);
    throw error;
  }
}

// Obtener todos los docentes sin paginación (para ConfigureAulaModal)
export async function obtenerTodosLosDocentes() {
  try {
    console.log("API obtenerTodosLosDocentes - llamando sin paginación");
    const { data } = await api.get("/docentes/admin-listar-docentes", { 
      params: { page: 1, limit: 100 } 
    });
    console.log("API obtenerTodosLosDocentes - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo docentes");
    }
    
    // El backend devuelve { ok: true, data: { items: [...], page: 1, ... } }
    // Necesitamos extraer solo los items
    const docentesArray = data.data?.items || data.data || [];
    console.log("API obtenerTodosLosDocentes - docentes extraídos:", docentesArray.length);
    
    return { ok: true, data: docentesArray };
  } catch (error) {
    console.error("Error en obtenerTodosLosDocentes:", error);
    throw error;
  }
}

// Actualizar docente (admin puede modificar cualquier docente)
export async function actualizarDocenteAdmin(id, datosActualizacion) {
  try {
    console.log(`🔄 Actualizando docente ${id} con datos:`, datosActualizacion);
    
    const { data } = await api.put(`/docentes/admin-actualizar-docente/${id}`, datosActualizacion);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error actualizando docente");
    }
    
    console.log('✅ Docente actualizado exitosamente:', data.data);
    return data.data; // Retorna datos del docente actualizado
  } catch (error) {
    console.error("❌ Error en actualizarDocenteAdmin:", error);
    throw error;
  }
}