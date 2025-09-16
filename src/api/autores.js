import api from "./client";

export async function listarAutores() {
  const { data } = await api.get("/autores");
  if (!data?.ok) throw new Error(data?.error || "Error listando autores");
  return data.data;
}

export async function obtenerAutorPorId(id) {
  const { data } = await api.get(`/autores/${id}`);
  if (!data?.ok) throw new Error(data?.error || "Error obteniendo autor");
  return data.data;
}

export async function crearAutor({ nombre, apellido }) {
  const body = { nombre, apellido };
  const { data } = await api.post("/autores", body, {
    headers: { "Content-Type": "application/json" },
  });
  if (!data?.ok) throw new Error(data?.error || "Error creando autor");
  return data.data; // { id_autor, nombre, apellido }
}


