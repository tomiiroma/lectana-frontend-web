import api from "./client";

// Obtener lista de administradores con paginación y filtros
export async function obtenerAdministradores({ page = 1, limit = 10, q = "" } = {}) {
  try {
    const params = { page, limit };
    if (q) params.q = q;
    
    console.log("API obtenerAdministradores - params enviados:", params);
    const { data } = await api.get("/administradores/admin-listar-administradores", { params });
    console.log("API obtenerAdministradores - respuesta:", data);
    
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
  console.log('🚀 FUNCIÓN obtenerAdministradorPorId INICIADA');
  console.log('🚀 ID recibido:', id);
  console.log('🚀 Tipo de ID:', typeof id);
  
  try {
    console.log(`🔄 Admin - Llamando a: /administradores/admin-obtener-administrador/${id}`);
    
    // Verificar que el ID sea válido
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('ID de administrador no válido');
    }
    
    const { data } = await api.get(`/administradores/admin-obtener-administrador/${id}`);
    
    console.log('🔍 Respuesta completa del backend:', data);
    console.log('🔍 data.ok:', data?.ok);
    console.log('🔍 data.data:', data?.data);
    console.log('🔍 data.administrador:', data?.administrador);
    console.log('🔍 data.error:', data?.error);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo administrador");
    }
    
    // El backend devuelve los datos en data.administrador para administradores
    const adminData = data.administrador || data.data;
    console.log('✅ Admin - Retornando datos:', adminData);
    return adminData;
  } catch (error) {
    console.error("❌ Error en obtenerAdministradorPorId:", error);
    console.error("❌ Status del error:", error.response?.status);
    console.error("❌ Datos del error:", error.response?.data);
    console.error("❌ URL llamada:", error.config?.url);
    throw error;
  }
}

// Obtener estadísticas de usuarios
export async function obtenerEstadisticasUsuarios() {
  try {
    const { data } = await api.get("/administradores/estadisticas-usuarios");
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo estadísticas");
    }
    
    return data.data; // Retorna { total_docentes, total_alumnos, total_administradores, total_usuarios, usuarios_activos, usuarios_inactivos }
  } catch (error) {
    console.error("Error en obtenerEstadisticasUsuarios:", error);
    throw error;
  }
}

// Obtener todos los usuarios activos (mezclados)
export async function obtenerUsuariosActivos({ page = 1, limit = 20, q = "" } = {}) {
  try {
    const params = { page, limit };
    if (q) params.q = q;
    
    console.log("API obtenerUsuariosActivos - params enviados:", params);
    const { data } = await api.get("/administradores/todos-usuarios-activos", { params });
    console.log("API obtenerUsuariosActivos - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo usuarios activos");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerUsuariosActivos:", error);
    throw error;
  }
}

// Obtener todos los usuarios inactivos (mezclados)
export async function obtenerUsuariosInactivos({ page = 1, limit = 20, q = "" } = {}) {
  try {
    const params = { page, limit };
    if (q) params.q = q;
    
    console.log("API obtenerUsuariosInactivos - params enviados:", params);
    const { data } = await api.get("/administradores/todos-usuarios-inactivos", { params });
    console.log("API obtenerUsuariosInactivos - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo usuarios inactivos");
    }
    
    return data.data; // Retorna { items, page, limit, total, total_pages }
  } catch (error) {
    console.error("Error en obtenerUsuariosInactivos:", error);
    throw error;
  }
}

// Actualizar administrador (admin puede modificar cualquier administrador)
export async function actualizarAdministradorAdmin(id, datosActualizacion) {
  try {
    console.log(`🔄 Actualizando administrador ${id} con datos:`, datosActualizacion);
    
    const { data } = await api.put(`/administradores/admin-actualizar-administrador/${id}`, datosActualizacion);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error actualizando administrador");
    }
    
    console.log('✅ Administrador actualizado exitosamente:', data.data);
    return data.data; // Retorna datos del administrador actualizado
  } catch (error) {
    console.error("❌ Error en actualizarAdministradorAdmin:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    console.error("❌ URL:", error.config?.url);
    console.error("❌ Request data:", error.config?.data);
    throw error;
  }
}