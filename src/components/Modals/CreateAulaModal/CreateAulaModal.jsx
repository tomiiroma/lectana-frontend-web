import { useState } from "react";
import { crearAula } from "../../../api/aulas";
import "./CreateAulaModal.css";

function CreateAulaModal({ isOpen, onClose, onCreated, onAulaCreated }) {
  const [formData, setFormData] = useState({
    nombre_aula: "",
    grado: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre_aula.trim()) {
      newErrors.nombre_aula = "El nombre del aula es requerido";
    }

    if (!formData.grado.trim()) {
      newErrors.grado = "El grado es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Creando aula con datos:", formData);
      const nuevaAula = await crearAula(formData);
      console.log("Aula creada exitosamente:", nuevaAula);
      
      // Resetear formulario
      setFormData({ nombre_aula: "", grado: "" });
      setErrors({});
      
      // Notificar que el aula fue creada y pasar al siguiente paso
      onAulaCreated?.(nuevaAula);
      
    } catch (error) {
      console.error("Error creando aula:", error);
      setErrors({ general: "Error al crear el aula. Inténtalo de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ nombre_aula: "", grado: "" });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">🏫</div>
            <h2 className="modal-title">Crear Nueva Aula</h2>
          </div>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-section">
              <h3 className="section-title">Información Básica</h3>
              <p className="section-description">Completa los datos básicos del aula</p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre_aula" className="form-label">
                    Nombre del Aula *
                  </label>
                  <input
                    type="text"
                    id="nombre_aula"
                    name="nombre_aula"
                    value={formData.nombre_aula}
                    onChange={handleInputChange}
                    placeholder="Ej: Aventuras de Lectura"
                    className={`form-input ${errors.nombre_aula ? "error" : ""}`}
                    disabled={loading}
                  />
                  {errors.nombre_aula && (
                    <span className="error-message">{errors.nombre_aula}</span>
                  )}
                  <div className="helper-text">
                    Un nombre descriptivo para identificar el aula
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="grado" className="form-label">
                    Grado *
                  </label>
                  <input
                    type="text"
                    id="grado"
                    name="grado"
                    value={formData.grado}
                    onChange={handleInputChange}
                    placeholder="Ej: 5° Grado A"
                    className={`form-input ${errors.grado ? "error" : ""}`}
                    disabled={loading}
                  />
                  {errors.grado && (
                    <span className="error-message">{errors.grado}</span>
                  )}
                  <div className="helper-text">
                    El grado o nivel educativo del aula
                  </div>
                </div>
              </div>
            </div>

            {errors.general && (
              <div className="error-banner">
                <div className="error-icon">⚠️</div>
                <span>{errors.general}</span>
              </div>
            )}
          </form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Creando...
              </>
            ) : (
              "Crear Aula"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateAulaModal;
