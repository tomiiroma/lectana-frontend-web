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