import api from "./client";

// Crear usuario base (para administradores)
export async function crearUsuario({ nombre, apellido, email, edad, password }) {
  try {
    const { data } = await api.post("/usuarios/crear-usuario", {
      nombre,
      apellido,
      email,
      edad,
      password
    });
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando usuario");
    }
    
    return data.data; // Retorna { id_usuario, ... }
  } catch (error) {
    console.error("Error en crearUsuario:", error);
    throw error;
  }
}

// Crear administrador (paso 2)
export async function crearAdministrador({ dni, usuario_id_usuario }) {
  try {
    const { data } = await api.post("/administradores/crear-administrador", {
      dni,
      usuario_id_usuario
    });
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando administrador");
    }
    
    return data.data; // Retorna datos del administrador creado
  } catch (error) {
    console.error("Error en crearAdministrador:", error);
    throw error;
  }
}
