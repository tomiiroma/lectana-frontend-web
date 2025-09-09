import api from "./client";

export async function crearCuento({ titulo, autor_id_autor, genero_id_genero, edad_publico, fuente, estado_legal, activo }) {
  // El backend exige 'contenido' (string). Usamos marcador mínimo.
  const body = {
    titulo,
    contenido: "PDF adjunto",
    autor_id_autor,
    genero_id_genero,
    edad_publico: Number(edad_publico),
    fuente,
    estado_legal: estado_legal || "dominio_publico",
    activo: typeof activo === "boolean" ? activo : true,
  };
  const { data } = await api.post("/api/cuentos", body);
  if (!data?.ok) throw new Error(data?.error || "Error creando cuento");
  return data.data; // debería contener id del cuento
}

export async function subirPDFCuento({ cuentoId, file }) {
  const form = new FormData();
  form.append("pdf", file);
  const { data } = await api.post(`/api/archivos/cuento/${cuentoId}/subir`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data?.ok) throw new Error(data?.error || "Error subiendo PDF");
  return data.data;
}


