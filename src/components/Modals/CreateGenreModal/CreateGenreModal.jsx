import React, { useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import "./CreateGenreModal.css";
import { crearGenero } from "../../../api/generos";

export default function CreateGenreModal({ isOpen, onClose, onCreated }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await crearGenero({
        nombre: formData.nombre.trim(),
      });

      onCreated?.();
      onClose?.();
      
      // Limpiar formulario
      setFormData({ nombre: "" });
      setErrors({});
    } catch (e) {
      setErrors({ submit: e.message || "Error creando género" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ nombre: "" });
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container create-genre-modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Crear Género</h2>
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
                  placeholder="Nombre del género"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
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
            <FaSave /> {loading ? "Creando..." : "Crear Género"}
          </button>
        </div>
      </div>
    </div>
  );
}
