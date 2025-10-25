import { useState } from "react";
import "./CreateLogroModal.css";
import { crearLogro } from '../../../api/logros';

function CreateLogroModal({ isOpen, onClose, onSuccess }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    descripcion: ""
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [errores, setErrores] = useState({});

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

  const eliminarImagen = () => {
    setImagenArchivo(null);
    setImagenPreview(null);

    const fileInput = document.getElementById('imagen');
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

    if (!imagenArchivo) {
      nuevosErrores.imagen = "Debes seleccionar una imagen";
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
    console.log("Creando logro...");
    
    
    const formData = new FormData();
    formData.append('nombre', datosFormulario.nombre);
    formData.append('descripcion', datosFormulario.descripcion);
    
    
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo);
    }
    
    
    const respuesta = await crearLogro(formData);
    console.log("Logro creado exitosamente:", respuesta);
    
   
    setDatosFormulario({ nombre: "", descripcion: "" });
    setImagenArchivo(null);
    setImagenPreview(null);
    setErrores({});
    
    
    onSuccess?.();
    onClose();
    
  } catch (error) {
    console.error("Error creando logro:", error);
    setErrores({ 
      general: error.response?.data?.error || "Error al crear el logro. Inténtalo de nuevo." 
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
      setErrores({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={manejarCierre}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header posicion">
          <div className="modal-title-section">
            <h2 className="modal-title posicion">Crear Nuevo Logro</h2>
          </div>
          <button className="modal-close" onClick={manejarCierre} disabled={cargando}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="create-form">
            <div className="form-section">
              <h3 className="section-title">Información del Logro</h3>
              <p className="section-description">Completa los datos del logro para motivar a los estudiantes</p>
              
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
                  <div className="helper-text">
                    Un nombre atractivo y motivador para el logro
                  </div>
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
                  <div className="helper-text">
                    Describe qué debe hacer el estudiante para conseguir este logro
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="imagen" className="form-label">
                    Imagen del Logro *
                  </label>
                  
                  {!imagenPreview ? (
                    <div className="image-upload-container">
                      <input
                        type="file"
                        id="imagen"
                        accept="image/*"
                        onChange={manejarCambioImagen}
                        className="file-input"
                        disabled={cargando}
                      />
                      <label htmlFor="imagen" className="file-label">
                        <span className="upload-text">Haz clic para seleccionar una imagen</span>
                        <span className="upload-hint">PNG, JPG (máx. 5MB)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="image-preview-container">
                      <img 
                        src={imagenPreview} 
                        alt="Vista previa" 
                        className="preview-image-large"
                      />
                      <button 
                        type="button"
                        className="btn-remove-image"
                        onClick={eliminarImagen}
                        disabled={cargando}
                      >
                        ✕ Eliminar imagen
                      </button>
                    </div>
                  )}
                  
                  {errores.imagen && (
                    <span className="error-message">{errores.imagen}</span>
                  )}
                  <div className="helper-text">
                    Selecciona una imagen que represente este logro
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
            disabled={cargando}
          >
            {cargando ? (
              <>
                <div className="loading-spinner"></div>
                Creando...
              </>
            ) : (
              "Crear Logro"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateLogroModal;