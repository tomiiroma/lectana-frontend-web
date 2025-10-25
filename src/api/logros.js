import api from './client';


export const crearLogro = async (formData) => {
  try {
    
    
    
    const response = await api.post('/logros', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log("Respuesta del backend:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear logro:', error.response?.data || error.message);
    throw error;
  }
};

export const obtenerLogros = async () => {
  try {
    const response = await api.get('/logros');
    return {
      ok: true,
      logros: response.data.data
    };
  } catch (error) {
    console.error('Error al obtener logros:', error);
    return {
      ok: false,
      error: error.response?.data?.message || error.message
    };
  }
};


export const eliminarLogro = async (id) => {
  try {
    const response = await api.delete(`/logros/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar logro:', error);
    throw error;
  }
};