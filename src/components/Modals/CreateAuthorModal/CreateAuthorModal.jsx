import React, { useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import "./CreateAuthorModal.css";
import { crearAutor } from "../../../api/autores";

export default function CreateAuthorModal({ isOpen, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await crearAutor({
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
      });

      onCreated?.();
      onClose?.();
      
      // Limpiar formulario
      setFormData({ nombre: "", apellido: "" });
      setErrors({});
    } catch (e) {
      setErrors({ submit: e.message || "Error creando autor" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: "", apellido: "" });
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container create-author-modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Crear Autor</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className={`form-input ${errors.nombre ? "error" : ""}`}
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre del autor"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className={`form-input ${errors.apellido ? "error" : ""}`}
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Apellido del autor"
                />
                {errors.apellido && <span className="error-message">{errors.apellido}</span>}
              </div>
            </div>
          </div>

          {errors.submit && <div className="error-banner">{errors.submit}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
            <FaSave /> {loading ? "Creando..." : "Crear Autor"}
          </button>
        </div>
      </div>
    </div>
  );
}
