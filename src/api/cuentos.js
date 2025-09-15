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
  const { data } = await api.get("/cuentos", { params });
  if (!data?.ok) throw new Error(data?.error || "Error listando cuentos");
  return data.data;
}

export async function obtenerCuentoPorId(id) {
  const { data } = await api.get(`/cuentos/${id}`);
  if (!data?.ok) throw new Error(data?.error || "Error obteniendo cuento");
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


