import { useState, useEffect } from "react";
import "./EditLogroModal.css";
import { obtenerLogroPorId, actualizarLogro } from "../../../api/logros";

function EditarLogroModal({ estaAbierto, alCerrar, alActualizar, logroId }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    descripcion: ""
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (estaAbierto && logroId) {
      cargarDatosLogro();
    }
  }, [estaAbierto, logroId]);

  const cargarDatosLogro = async () => {
  setCargandoDatos(true);
  try {
    const response = await obtenerLogroPorId(logroId);
    
    if (response.ok) {
      const logro = response.logro;
      setDatosFormulario({
        nombre: logro.nombre,
        descripcion: logro.descripcion
      });
      setImagenActual(logro.url_imagen);
      setImagenPreview(logro.url_imagen);
    } else {
      setErrores({ general: 'Error al cargar el logro' });
    }
  } catch (error) {
    console.error("Error cargando logro:", error);
    setErrores({ general: 'Error al cargar el logro' });
  } finally {
    setCargandoDatos(false);
  }
  };


const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };


  const manejarCambioImagen = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrores(prev => ({
          ...prev,
          imagen: "El archivo debe ser una imagen"
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrores(prev => ({
          ...prev,
          imagen: "La imagen no debe superar los 5MB"
        }));
        return;
      }

      setImagenArchivo(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errores.imagen) {
        setErrores(prev => ({
          ...prev,
          imagen: ""
        }));
      }
    }
  };

  const restaurarImagenOriginal = () => {
    setImagenArchivo(null);
    setImagenPreview(imagenActual);
    const fileInput = document.getElementById('imagen-edit');
    if (fileInput) fileInput.value = '';
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del logro es requerido";
    }

    if (!datosFormulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

const manejarEnvio = async (e) => {
  e.preventDefault();
  
  if (!validarFormulario()) {
    return;
  }

  setCargando(true);
  try {
    const formData = new FormData();
    formData.append('nombre', datosFormulario.nombre);
    formData.append('descripcion', datosFormulario.descripcion);
    
   
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo);
    }
    
    await actualizarLogro(logroId, formData);
    
    console.log(" Logro actualizado exitosamente");
    
    alActualizar?.();
    manejarCierre();
  } catch (error) {
    console.error("Error actualizando logro:", error);
    setErrores({ 
      general: error.response?.data?.error || "Error al actualizar el logro. Inténtalo de nuevo." 
    });
  } finally {
    setCargando(false);
  }
};

  const manejarCierre = () => {
    if (!cargando) {
      setDatosFormulario({ nombre: "", descripcion: "" });
      setImagenArchivo(null);
      setImagenPreview(null);
      setImagenActual(null);
      setErrores({});
      alCerrar();
    }
  };

  if (!estaAbierto) return null;

  return (
    <div className="modal-overlay" onClick={manejarCierre}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Editar Logro</h2>
          </div>
          <button className="modal-close" onClick={manejarCierre} disabled={cargando}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {cargandoDatos ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando datos del logro...</p>
            </div>
          ) : (
            <div className="create-form">
              <div className="form-section">
                <h3 className="section-title">Información del Logro</h3>
                <p className="section-description">Actualiza los datos del logro</p>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del Logro *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={datosFormulario.nombre}
                      onChange={manejarCambioInput}
                      placeholder="Ej: Primer Libro Leído"
                      className={`form-input ${errores.nombre ? "error" : ""}`}
                      disabled={cargando}
                    />
                    {errores.nombre && (
                      <span className="error-message">{errores.nombre}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción *
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={datosFormulario.descripcion}
                      onChange={manejarCambioInput}
                      placeholder="Ej: Completa tu primera lectura en la plataforma"
                      className={`form-input form-textarea ${errores.descripcion ? "error" : ""}`}
                      disabled={cargando}
                      rows="3"
                    />
                    {errores.descripcion && (
                      <span className="error-message">{errores.descripcion}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="imagen-edit" className="form-label">
                      Imagen del Logro
                    </label>
                    
                    <div className="image-preview-container">
                      <img 
                        src={imagenPreview} 
                        alt="Vista previa" 
                        className="preview-image-large"
                      />
                      <div className="image-actions">
                        <label htmlFor="imagen-edit" className="btn-change-image">
                           Cambiar imagen
                        </label>
                        <input
                          type="file"
                          id="imagen-edit"
                          accept="image/*"
                          onChange={manejarCambioImagen}
                          className="file-input"
                          disabled={cargando}
                        />
                        {imagenArchivo && (
                          <button 
                            type="button"
                            className="btn-restore-image"
                            onClick={restaurarImagenOriginal}
                            disabled={cargando}
                          >
                            ↺ Restaurar original
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {errores.imagen && (
                      <span className="error-message">{errores.imagen}</span>
                    )}
                    <div className="helper-text">
                      {imagenArchivo 
                        ? "Nueva imagen seleccionada. Se actualizará al guardar."
                        : "Mantén la imagen actual o selecciona una nueva"
                      }
                    </div>
                  </div>
                </div>
              </div>

              {errores.general && (
                <div className="error-banner">
                  <span>{errores.general}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={manejarCierre}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-submit"
            onClick={manejarEnvio}
            disabled={cargando || cargandoDatos}
          >
            {cargando ? (
              <>
                <div className="loading-spinner"></div>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarLogroModal;