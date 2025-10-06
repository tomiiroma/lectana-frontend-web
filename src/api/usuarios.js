import api from "./client";

// Obtener perfil de usuario por ID base (para tablas mixtas)
export async function obtenerPerfilPorIdUsuario(idUsuario) {
  console.log('🚀 FUNCIÓN obtenerPerfilPorIdUsuario INICIADA');
  console.log('🚀 ID recibido:', idUsuario);
  console.log('🚀 Tipo de ID:', typeof idUsuario);
  
  try {
    console.log(`🔄 Obteniendo perfil por id_usuario: ${idUsuario}`);
    const { data } = await api.get(`/usuarios/${idUsuario}`);
    
    console.log('🔍 Respuesta completa del backend:', data);
    console.log('🔍 data.usuario:', data.usuario);
    console.log('🔍 data.data:', data.data);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error obteniendo perfil de usuario");
    }
    
    // El backend devuelve los datos en data.usuario, no en data.data
    const userData = data.usuario || data.data;
    console.log('✅ Retornando datos:', userData);
    return userData; // Retorna datos completos del usuario
  } catch (error) {
    console.error("❌ Error en obtenerPerfilPorIdUsuario:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ URL:", error.config?.url);
    throw error;
  }
}

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


export async function desactivarUsuario(id_usuario){
  try{
    const { data } = await api.put(`usuarios/desactivarUsuario/${id_usuario}`)
    
    if (!data?.ok){
            throw new Error(data?.error || "Error desactivando Usuario");
    }

     return data.message;
  }catch(error){
    console.error("Error desactivando Usuario", error)
    throw error
  }
}

  export async function activarUsuario(id_usuario){
  try{
    const { data } = await api.put(`usuarios/activarUsuario/${id_usuario}`)
    
    if (!data?.ok){
            throw new Error(data?.error || "Error activando Usuario");
    }

     return data.message;
  }catch(error){
    console.error("Error activando Usuario", error)
    throw error
  }
}