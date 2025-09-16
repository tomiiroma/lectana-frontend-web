import React, { useState } from 'react';
import { FaChalkboardTeacher, FaArrowLeft, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import './CreateTeacherForm.css';

const CreateTeacherForm = ({ onBack, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    password: '',
    dni: '',
    institucion_nombre: '',
    institucion_pais: '',
    institucion_provincia: '',
    nivel_educativo: '',
    telefono: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const nivelEducativoOptions = [
    { value: '', label: 'Seleccionar nivel educativo' },
    { value: 'PRIMARIA', label: 'Primaria' },
    { value: 'SECUNDARIA', label: 'Secundaria' },
    { value: 'AMBOS', label: 'Ambos' }
  ];

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
      if (isNaN(edad) || edad < 18 || edad > 80) {
        newErrors.edad = 'La edad debe estar entre 18 y 80 años';
      }
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.trim().length < 6) {
      newErrors.dni = 'El DNI debe tener al menos 6 caracteres';
    }

    // Validar institución nombre
    if (!formData.institucion_nombre.trim()) {
      newErrors.institucion_nombre = 'El nombre de la institución es requerido';
    }

    // Validar institución país
    if (!formData.institucion_pais.trim()) {
      newErrors.institucion_pais = 'El país de la institución es requerido';
    }

    // Validar institución provincia
    if (!formData.institucion_provincia.trim()) {
      newErrors.institucion_provincia = 'La provincia de la institución es requerida';
    }

    // Validar nivel educativo
    if (!formData.nivel_educativo) {
      newErrors.nivel_educativo = 'El nivel educativo es requerido';
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
        telefono: formData.telefono || null
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
          <div className="form-icon form-icon-green">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h2 className="form-title">Crear Docente</h2>
            <p className="form-subtitle">Completa los datos del nuevo docente</p>
          </div>
        </div>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Datos Personales</h3>
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
                placeholder="18-80 años"
                min="18"
                max="80"
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
              <label htmlFor="dni" className="form-label">
                DNI *
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className={`form-input ${errors.dni ? 'error' : ''}`}
                placeholder="Número de documento"
              />
              {errors.dni && <span className="error-message">{errors.dni}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Datos Institucionales</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="institucion_nombre" className="form-label">
                Nombre de la Institución *
              </label>
              <input
                type="text"
                id="institucion_nombre"
                name="institucion_nombre"
                value={formData.institucion_nombre}
                onChange={handleInputChange}
                className={`form-input ${errors.institucion_nombre ? 'error' : ''}`}
                placeholder="Nombre de la escuela/colegio"
              />
              {errors.institucion_nombre && <span className="error-message">{errors.institucion_nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="institucion_pais" className="form-label">
                País *
              </label>
              <input
                type="text"
                id="institucion_pais"
                name="institucion_pais"
                value={formData.institucion_pais}
                onChange={handleInputChange}
                className={`form-input ${errors.institucion_pais ? 'error' : ''}`}
                placeholder="País de la institución"
              />
              {errors.institucion_pais && <span className="error-message">{errors.institucion_pais}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="institucion_provincia" className="form-label">
                Provincia *
              </label>
              <input
                type="text"
                id="institucion_provincia"
                name="institucion_provincia"
                value={formData.institucion_provincia}
                onChange={handleInputChange}
                className={`form-input ${errors.institucion_provincia ? 'error' : ''}`}
                placeholder="Provincia/Estado"
              />
              {errors.institucion_provincia && <span className="error-message">{errors.institucion_provincia}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nivel_educativo" className="form-label">
                Nivel Educativo *
              </label>
              <select
                id="nivel_educativo"
                name="nivel_educativo"
                value={formData.nivel_educativo}
                onChange={handleInputChange}
                className={`form-input ${errors.nivel_educativo ? 'error' : ''}`}
              >
                {nivelEducativoOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.nivel_educativo && <span className="error-message">{errors.nivel_educativo}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefono" className="form-label">
                Teléfono (Opcional)
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Número de teléfono"
              />
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-cancel" onClick={onBack}>
            Cancelar
          </button>
          <button type="submit" className="btn-submit btn-submit-green" disabled={loading}>
            <FaSave />
            {loading ? 'Creando...' : 'Crear Docente'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeacherForm;
