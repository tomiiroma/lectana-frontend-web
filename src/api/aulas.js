import api from "./client";

// Listar todas las aulas
export async function listarAulas() {
  try {
    console.log("API listarAulas - solicitando aulas...");
    const { data } = await api.get("/aulas");
    console.log("API listarAulas - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error listando aulas");
    }
    
    return data.data; // Retorna array de aulas
  } catch (error) {
    console.error("Error en listarAulas:", error);
    throw error;
  }
}

// Obtener aula por ID
export async function obtenerAulaPorId(id) {
  try {
    console.log(`API obtenerAulaPorId - solicitando aula ${id}...`);
    const { data } = await api.get(`/aulas/${id}`);
    console.log(`API obtenerAulaPorId - respuesta:`, data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo aula");
    }
    
    return data.data; // Retorna datos del aula
  } catch (error) {
    console.error(`Error en obtenerAulaPorId para aula ${id}:`, error);
    throw error;
  }
}

// Crear nueva aula
export async function crearAula({ nombre_aula, grado }) {
  try {
    console.log("API crearAula - datos:", { nombre_aula, grado });
    const { data } = await api.post("/aulas", {
      nombre_aula,
      grado
    });
    console.log("API crearAula - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando aula");
    }
    
    return data.data; // Retorna datos del aula creada
  } catch (error) {
    console.error("Error en crearAula:", error);
    throw error;
  }
}

// Editar aula
export async function editarAula({ id, nombre_aula, grado, docente_id_docente }) {
  try {
    console.log(`API editarAula - editando aula ${id}:`, { nombre_aula, grado, docente_id_docente });
    
    // Construir payload solo con los campos que tienen valor
    const payload = { nombre_aula, grado };
    if (docente_id_docente !== null && docente_id_docente !== undefined) {
      payload.docente_id_docente = docente_id_docente;
    }
    
    const { data } = await api.put(`/aulas/${id}`, payload);
    console.log(`API editarAula - respuesta:`, data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error editando aula");
    }
    
    return data.data; // Retorna datos del aula editada
  } catch (error) {
    console.error(`Error en editarAula para aula ${id}:`, error);
    throw error;
  }
}

// Asignar estudiantes a un aula
export async function asignarEstudiantesAula({ aulaId, estudiantesIds }) {
  try {
    console.log(`API asignarEstudiantesAula - asignando estudiantes a aula ${aulaId}:`, estudiantesIds);
    const { data } = await api.put(`/aulas/${aulaId}/estudiantes`, {
      estudiantes_ids: estudiantesIds
    });
    console.log(`API asignarEstudiantesAula - respuesta:`, data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error asignando estudiantes al aula");
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error en asignarEstudiantesAula para aula ${aulaId}:`, error);
    throw error;
  }
}

// Asignar cuentos a un aula
export async function asignarCuentosAula({ aulaId, cuentosIds }) {
  try {
    console.log(`API asignarCuentosAula - asignando cuentos a aula ${aulaId}:`, cuentosIds);
    const { data } = await api.put(`/aulas/${aulaId}/cuentos`, {
      cuentos_ids: cuentosIds
    });
    console.log(`API asignarCuentosAula - respuesta:`, data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error asignando cuentos al aula");
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error en asignarCuentosAula para aula ${aulaId}:`, error);
    throw error;
  }
}

// Obtener estadísticas de aulas
export async function obtenerEstadisticasAulas() {
  try {
    console.log("API obtenerEstadisticasAulas - solicitando estadísticas...");
    const { data } = await api.get("/aulas/estadisticas/total");
    console.log("API obtenerEstadisticasAulas - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo estadísticas de aulas");
    }
    
    return data.data; // Retorna estadísticas de aulas
  } catch (error) {
    console.error("Error en obtenerEstadisticasAulas:", error);
    throw error;
  }
}
