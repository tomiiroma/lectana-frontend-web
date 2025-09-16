import React, { useState } from 'react';
import { FaUserGraduate, FaArrowLeft, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import './CreateStudentForm.css';

const CreateStudentForm = ({ onBack, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    password: '',
    aula_id: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2 || formData.nombre.trim().length > 50) {
      newErrors.nombre = 'El nombre debe tener entre 2 y 50 caracteres';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2 || formData.apellido.trim().length > 50) {
      newErrors.apellido = 'El apellido debe tener entre 2 y 50 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar edad
    if (!formData.edad) {
      newErrors.edad = 'La edad es requerida';
    } else {
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 5 || edad > 18) {
        newErrors.edad = 'La edad debe estar entre 5 y 18 años';
      }
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar aula_id (opcional)
    if (formData.aula_id && isNaN(parseInt(formData.aula_id))) {
      newErrors.aula_id = 'El ID del aula debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        edad: parseInt(formData.edad),
        aula_id: formData.aula_id ? parseInt(formData.aula_id) : null
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="create-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={onBack}>
          <FaArrowLeft />
          Volver
        </button>
        <div className="form-title-section">
          <div className="form-icon form-icon-blue">
            <FaUserGraduate />
          </div>
          <div>
            <h2 className="form-title">Crear Estudiante</h2>
            <p className="form-subtitle">Completa los datos del nuevo estudiante</p>
          </div>
        </div>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              placeholder="Ingresa el nombre"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido" className="form-label">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className={`form-input ${errors.apellido ? 'error' : ''}`}
              placeholder="Ingresa el apellido"
            />
            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="ejemplo@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="edad" className="form-label">
              Edad *
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              className={`form-input ${errors.edad ? 'error' : ''}`}
              placeholder="5-18 años"
              min="5"
              max="18"
            />
            {errors.edad && <span className="error-message">{errors.edad}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña *
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="aula_id" className="form-label">
              ID del Aula (Opcional)
            </label>
            <input
              type="number"
              id="aula_id"
              name="aula_id"
              value={formData.aula_id}
              onChange={handleInputChange}
              className={`form-input ${errors.aula_id ? 'error' : ''}`}
              placeholder="Número del aula"
            />
            {errors.aula_id && <span className="error-message">{errors.aula_id}</span>}
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-cancel" onClick={onBack}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit btn-submit-blue" disabled={loading}>
            <FaSave />
            {loading ? 'Creando...' : 'Crear Estudiante'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStudentForm;
