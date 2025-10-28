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


export const obtenerLogroPorId = async (id) => {
  try {
    const response = await api.get(`/logros/${id}`);
    return {
      ok: true,
      logro: response.data.data
    };
  } catch (error) {
    console.error('Error al obtener logro:', error);
    return {
      ok: false,
      error: error.response?.data?.message || error.message
    };
  }
};



export const actualizarLogro = async (id, formData) => {
  try {
    console.log(" Actualizando logro...");
    
    
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await api.put(`/logros/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log(" Logro actualizado:", response.data);
    return response.data;
  } catch (error) {
    console.error(' Error al actualizar logro:', error.response?.data || error.message);
    throw error;
  }
};