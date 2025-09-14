import api from "./client";

// Crear usuario base (para administradores)
export async function crearUsuario({ nombre, apellido, email, edad, password }) {
  try {
    const { data } = await api.post("/usuarios/", {
      nombre,
      apellido,
      email,
      edad,
      password
    });
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error creando usuario");
    }
    
    console.log('🔍 Respuesta completa del backend:', data);
    console.log('🔍 data.data:', data.data);
    console.log('🔍 data.usuario:', data.usuario);
    
    // Retornar la estructura completa para que el componente pueda manejarla
    return data;
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
