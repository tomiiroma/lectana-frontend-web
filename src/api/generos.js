import api from "./client";

export async function listarGeneros() {
  const { data } = await api.get("/generos");
  if (!data?.ok) throw new Error(data?.error || "Error listando géneros");
  return data.data;
}

export async function obtenerGeneroPorId(id) {
  const { data } = await api.get(`/generos/${id}`);
  if (!data?.ok) throw new Error(data?.error || "Error obteniendo género");
  return data.data;
}

export async function crearGenero({ nombre }) {
  const body = { nombre };
  const { data } = await api.post("/generos", body, {
    headers: { "Content-Type": "application/json" },
  });
  if (!data?.ok) throw new Error(data?.error || "Error creando género");
  return data.data; // { id_genero, nombre }
}


