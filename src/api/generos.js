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


//  Obtener géneros/categorías públicas
 
export async function obtenerGenerosPublicos() {
  try {
    const response = await api.get("/generos/publicos");
    
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error al obtener géneros públicos:", error);
    throw error;
  }
}


//  Contar cuentos por género
 
export async function contarCuentosPorGenero(generos, cuentos) {
  const contador = {};
  
  generos.forEach(genero => {
    const cantidad = cuentos.filter(
      cuento => cuento.genero?.nombre?.toLowerCase() === genero.nombre.toLowerCase()
    ).length;
    contador[genero.nombre] = cantidad;
  });
  
  return contador;
}


