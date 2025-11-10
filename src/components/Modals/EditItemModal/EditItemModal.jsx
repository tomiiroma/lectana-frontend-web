import { useState, useEffect } from "react";
import "./EditItemModal.css";
import { obtenerItemPorId, actualizarItem } from "../../../api/items";

function EditarItemModal({ estaAbierto, alCerrar, alActualizar, itemId }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: ""
  });
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (estaAbierto && itemId) {
      cargarDatosItem();
    }
  }, [estaAbierto, itemId]);

  const cargarDatosItem = async () => {
    setCargandoDatos(true);
    try {
      const response = await obtenerItemPorId(itemId);
      
      if (response.ok) {
        const item = response.item;
        setDatosFormulario({
          nombre: item.nombre,
          descripcion: item.descripcion,
          precio: item.precio.toString()
        });
        setImagenActual(item.url_imagen);
        setImagenPreview(item.url_imagen);
      } else {
        setErrores({ general: 'Error al cargar el item' });
      }
    } catch (error) {
      console.error("Error cargando item:", error);
      setErrores({ general: 'Error al cargar el item' });
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
      nuevosErrores.nombre = "El nombre del avatar es requerido";
    }

    if (!datosFormulario.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida";
    }

    const precioNum = Number(datosFormulario.precio);
    if (isNaN(precioNum) || precioNum < 0) {
      nuevosErrores.precio = "El precio debe ser un número mayor o igual a 0";
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
      formData.append('precio', datosFormulario.precio);
      
      if (imagenArchivo) {
        formData.append('imagen', imagenArchivo);
      }
      
      const resultado = await actualizarItem(itemId, formData);
      
      if (resultado.ok) {
        console.log(" Item actualizado exitosamente");
        alActualizar?.();
        manejarCierre();
      } else {
        setErrores({ 
          general: resultado.error || "Error al actualizar el item" 
        });
      }
    } catch (error) {
      console.error("Error actualizando item:", error);
      setErrores({ 
        general: error.response?.data?.error || "Error al actualizar el item. Inténtalo de nuevo." 
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarCierre = () => {
    if (!cargando) {
      setDatosFormulario({ nombre: "", descripcion: "", precio: "" });
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
            <h2 className="modal-title">Editar Avatar</h2>
          </div>
          <button className="modal-close" onClick={manejarCierre} disabled={cargando}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {cargandoDatos ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando datos del avatar...</p>
            </div>
          ) : (
            <div className="create-form">
              <div className="form-section">
                <h3 className="section-title">Información del Avatar</h3>
                <p className="section-description">Actualiza los datos del avatar</p>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="nombre" className="form-label">
                      Nombre del Avatar *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={datosFormulario.nombre}
                      onChange={manejarCambioInput}
                      placeholder="Ej: Avatar Robot Futurista"
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
                      placeholder="Ej: Avatar con diseño moderno y futurista"
                      className={`form-input form-textarea ${errores.descripcion ? "error" : ""}`}
                      disabled={cargando}
                      rows="3"
                    />
                    {errores.descripcion && (
                      <span className="error-message">{errores.descripcion}</span>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="precio" className="form-label">
                      Precio (en puntos) *
                    </label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      value={datosFormulario.precio}
                      onChange={manejarCambioInput}
                      min="0"
                      placeholder="Ej: 100"
                      className={`form-input ${errores.precio ? "error" : ""}`}
                      disabled={cargando}
                    />
                    {errores.precio && (
                      <span className="error-message">{errores.precio}</span>
                    )}
                    <div className="helper-text">
                      Cantidad de puntos necesarios para comprar este avatar
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="imagen-edit" className="form-label">
                      Imagen del Avatar
                    </label>
                    
                    <div className="image-preview-container">
                      <img 
                        src={imagenPreview} 
                        alt="Vista previa" 
                        className="preview-image-large"
                      />
                      <div className="image-actions">
                        <label htmlFor="imagen-edit" className="btn-change-image">
                          📷 Cambiar imagen
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

export default EditarItemModal;