import api from './client';

export const crearItem = async (formData) => {
  try {
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear item:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener alumnos que compraron un item
export const obtenerAlumnosItem = async (itemId) => {
  try {
    const response = await api.get(`/items/${itemId}/alumnos`);
    return {
      ok: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error al obtener alumnos del item:', error);
    return {
      ok: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// trae todos los avatares

export const obtenerItems = async () => {
  try {
    const response = await api.get('/items');
    return {
      ok: true,
      items: response.data.data
    };
  } catch (error) {
    console.error('Error al obtener items:', error);
    return {
      ok: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Trae el avatar que coincida con la id

export const obtenerItemPorId = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return {
      ok: true,
      item: response.data.data
    };
  } catch (error) {
    console.error('Error al obtener item:', error);
    return {
      ok: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// Deshabilitar item
export const eliminarItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return {
      ok: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error al eliminar item:', error);
    return {
      ok: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Reactivar item
export const reactivarItem = async (id) => {
  try {
    const response = await api.patch(`/items/${id}/reactivar`);
    return {
      ok: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error al reactivar item:', error);
    return {
      ok: false,
      error: error.response?.data?.error || error.message
    };
  }
};

// Actualizar item

export const actualizarItem = async (itemId, formData) => {
  try {
    const response = await api.put(`/items/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      ok: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error al actualizar item:', error.response?.data || error.message);
    return {
      ok: false,
      error: error.response?.data?.error || error.message
    };
  }
};
