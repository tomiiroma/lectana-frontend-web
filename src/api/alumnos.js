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

// Crear nuevo alumno
export async function crearAlumno({ nombre, apellido, email, edad, password, aula_id = null }) {
  try {
    const { data } = await api.post("/alumnos/crear-alumno", {
      nombre,
      apellido,
      email,
      edad,
      password,
      aula_id
    });
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando alumno");
    }
    
    return data.data; // Retorna datos del alumno creado
  } catch (error) {
    console.error("Error en crearAlumno:", error);
    throw error;
  }
}

// Obtener alumno específico por ID
export async function obtenerAlumnoPorId(id) {
  try {
    console.log(`🔄 Alumno - Llamando a: /alumnos/admin-obtener-alumno/${id}`);
    const { data } = await api.get(`/alumnos/admin-obtener-alumno/${id}`);
    
    console.log('🔍 Alumno - Respuesta completa:', data);
    console.log('🔍 Alumno - data.ok:', data?.ok);
    console.log('🔍 Alumno - data.data:', data?.data);
    console.log('🔍 Alumno - data.error:', data?.error);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo alumno");
    }
    
    console.log('✅ Alumno - Retornando datos:', data.data);
    // El backend devuelve los datos en data.data
    return data.data;
  } catch (error) {
    console.error("❌ Error en obtenerAlumnoPorId:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ URL:", error.config?.url);
    throw error;
  }
}

// Actualizar alumno (admin puede modificar cualquier alumno)
export async function actualizarAlumnoAdmin(id, datosActualizacion) {
  try {
    console.log(`🔄 Actualizando alumno ${id} con datos:`, datosActualizacion);
    
    const { data } = await api.put(`/alumnos/admin-actualizar-alumno/${id}`, datosActualizacion);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error actualizando alumno");
    }
    
    console.log('✅ Alumno actualizado exitosamente:', data.data);
    return data.data; // Retorna datos del alumno actualizado
  } catch (error) {
    console.error("❌ Error en actualizarAlumnoAdmin:", error);
    throw error;
  }
}