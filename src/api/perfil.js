import api from "./client";

// Obtener perfil del administrador autenticado usando datos del contexto
export async function obtenerPerfilAdministradorDesdeContext(user) {
  try {
    console.log('🔄 Obteniendo perfil del administrador desde contexto...');
    
    if (!user) {
      throw new Error("No hay usuario autenticado");
    }
    
    // Si el usuario es administrador, intentar obtener datos específicos del administrador
    if (user.rol?.toLowerCase() === 'administrador') {
      try {
        // Intentar obtener datos específicos del administrador usando el ID del usuario
        const { data: adminData } = await api.get(`/administradores/admin-obtener-administrador/${user.id_usuario}`);
        
        if (adminData?.ok && adminData.administrador) {
          // Combinar datos del usuario con datos específicos del administrador
          const perfilCompleto = {
            ...adminData.administrador,
            usuario: user
          };
          console.log('✅ Perfil completo del administrador obtenido:', perfilCompleto);
          return perfilCompleto;
        }
      } catch (adminError) {
        console.log('⚠️ No se pudieron obtener datos específicos del administrador, usando datos básicos');
      }
    }
    
    // Si no es administrador o no se pudieron obtener datos específicos, devolver datos básicos
    const perfilBasico = {
      id_administrador: user.id_usuario,
      dni: user.dni || 'No disponible',
      usuario_id_usuario: user.id_usuario,
      usuario: user
    };
    
    console.log('✅ Perfil básico del administrador obtenido:', perfilBasico);
    return perfilBasico;
    
  } catch (error) {
    console.error("❌ Error en obtenerPerfilAdministradorDesdeContext:", error);
    throw error;
  }
}

// Actualizar perfil del administrador autenticado
export async function actualizarPerfilAdministrador(datosActualizacion) {
  try {
    console.log('🔄 Actualizando perfil del administrador con datos:', datosActualizacion);
    
    // Usar el endpoint existente de actualización de administrador
    // Necesitamos el ID del administrador, que debería estar en los datos
    const { data } = await api.put('/administradores/admin-actualizar-administrador', datosActualizacion);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error actualizando perfil del administrador");
    }
    
    console.log('✅ Perfil del administrador actualizado:', data.data);
    return data.data;
  } catch (error) {
    console.error("❌ Error en actualizarPerfilAdministrador:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
}

// Cambiar contraseña del administrador autenticado
export async function cambiarContrasenaAdministrador(datosContrasena) {
  try {
    console.log('🔄 Cambiando contraseña del administrador...');
    
    // Usar endpoint genérico de cambio de contraseña si existe
    const { data } = await api.put('/auth/cambiar-contrasena', datosContrasena);
    
    if (!data?.ok) {
      throw new Error(data?.error || "Error cambiando contraseña");
    }
    
    console.log('✅ Contraseña cambiada exitosamente');
    return data.data;
  } catch (error) {
    console.error("❌ Error en cambiarContrasenaAdministrador:", error);
    console.error("❌ Status:", error.response?.status);
    console.error("❌ Error data:", error.response?.data);
    throw error;
  }
}
