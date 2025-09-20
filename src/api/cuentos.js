import api from "./client";

// Versión alineada con el tutorial del backend
export async function crearCuentoV2({
  titulo,
  edad_publico,
  autor_id_autor,
  genero_id_genero,
}) {
  const body = {
    titulo,
    edad_publico: Number(edad_publico),
    autor_id_autor: Number(autor_id_autor),
    genero_id_genero: Number(genero_id_genero),
  };
  console.log("API enviando body:", body);
  try {
    const { data } = await api.post("/cuentos", body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("API respuesta exitosa:", data);
    if (!data?.ok) throw new Error(data?.error || "Error creando cuento");
    return data.data;
  } catch (error) {
    console.error("Error en API crearCuentoV2:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);
    throw error;
  }
}

// Nuevo flujo: crear cuento plano (sin archivos)
export async function crearCuentoPlano({ titulo, edad_publico, autor_id_autor, genero_id_genero }) {
  console.log("API crearCuentoPlano recibió:", { titulo, edad_publico, autor_id_autor, genero_id_genero });
  return crearCuentoV2({ titulo, edad_publico, autor_id_autor, genero_id_genero });
}

export async function listarCuentos(params = {}) {
  console.log("API listarCuentos - params recibidos:", params);
  const { data } = await api.get("/cuentos", { params });
  console.log("API listarCuentos - respuesta:", data);
  if (!data?.ok) throw new Error(data?.error || "Error listando cuentos");
  return data.data; // Retorna array de cuentos para usuarios.jsx
}

// Obtener todos los cuentos sin paginación (para ConfigureAulaModal)
export async function obtenerTodosLosCuentos() {
  try {
    console.log("API obtenerTodosLosCuentos - llamando sin paginación");
    const { data } = await api.get("/cuentos");
    console.log("API obtenerTodosLosCuentos - respuesta:", data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo cuentos");
    }
    
    // Los cuentos pueden devolver estructura simple o con paginación
    // Verificamos si tiene items o es array directo
    const cuentosArray = data.data?.items || data.data || [];
    console.log("API obtenerTodosLosCuentos - cuentos extraídos:", cuentosArray.length);
    
    return { ok: true, data: cuentosArray };
  } catch (error) {
    console.error("Error en obtenerTodosLosCuentos:", error);
    throw error;
  }
}


export async function obtenerCuentoPorId(id) {
  const { data } = await api.get(`/cuentos/${id}`);
  if (!data?.ok) throw new Error(data?.error || "Error obteniendo cuento");
  return data.data;
}

export async function obtenerTotalCuentos() {
  const { data } = await api.get(`/cuentos/estadisticas/total`);
  if (!data?.ok) throw new Error(data?.error || "Error obteniendo total de cuentos");
  return data.data?.total ?? 0;
}

// Editar cuento: PUT /api/cuentos/:id
export async function editarCuento({ id, titulo, edad_publico, autor_id_autor, genero_id_genero, duracion, pdf_url, url_img }) {
  const body = {};
  if (titulo !== undefined) body.titulo = titulo;
  if (edad_publico !== undefined) body.edad_publico = Number(edad_publico);
  if (autor_id_autor !== undefined) body.autor_id_autor = Number(autor_id_autor);
  if (genero_id_genero !== undefined) body.genero_id_genero = Number(genero_id_genero);
  if (duracion !== undefined) body.duracion = Number(duracion);
  if (pdf_url !== undefined) body.pdf_url = pdf_url;
  if (url_img !== undefined) body.url_img = url_img;
  
  const { data } = await api.put(`/cuentos/${id}`, body, {
    headers: { "Content-Type": "application/json" },
  });
  if (!data?.ok) throw new Error(data?.error || "Error editando cuento");
  return data.data;
}

// Subir PDF al cuento: POST /api/cuentos/:id/upload-pdf (form-data: file)
export async function subirPDFCuentoV2({ cuentoId, file }) {
  const form = new FormData();
  form.append("file", file);
  // No seteamos Content-Type manualmente para que axios incluya el boundary
  const { data } = await api.post(`/cuentos/${cuentoId}/upload-pdf`, form);
  if (!data?.ok) throw new Error(data?.error || "Error subiendo PDF");
  return data.data;
}

// Subir imagen portada: POST /api/imagenes/cuentos/:id/upload-imagen (form-data: file)
export async function subirImagenCuento({ cuentoId, file }) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post(`/imagenes/cuentos/${cuentoId}/upload-imagen`, form);
  if (!data?.ok) throw new Error(data?.error || "Error subiendo imagen");
  return data.data;
}


