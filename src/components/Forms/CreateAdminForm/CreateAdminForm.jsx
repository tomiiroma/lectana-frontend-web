import React, { useState } from 'react';
import { FaUserShield, FaArrowLeft, FaSave, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
import './CreateAdminForm.css';

const CreateAdminForm = ({ onBack, onSubmit, loading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Usuario base
    nombre: '',
    apellido: '',
    email: '',
    edad: '',
    password: '',
    // Paso 2: Datos admin
    dni: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [createdUserId, setCreatedUserId] = useState(null);

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

  const validateStep1 = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 1) {
      newErrors.nombre = 'El nombre debe tener al menos 1 carácter';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 1) {
      newErrors.apellido = 'El apellido debe tener al menos 1 carácter';
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
      if (isNaN(edad) || edad < 5 || edad > 120) {
        newErrors.edad = 'La edad debe estar entre 5 y 120 años';
      }
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    // Validar DNI
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.trim().length < 6) {
      newErrors.dni = 'El DNI debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (validateStep1()) {
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        edad: parseInt(formData.edad),
        password: formData.password
      };
      
      // Simular creación de usuario (aquí llamarías a la API)
      try {
        // const response = await crearUsuario(userData);
        // setCreatedUserId(response.id_usuario);
        setCreatedUserId(123); // Simulación
        setCurrentStep(2);
      } catch (error) {
        console.error('Error creando usuario:', error);
      }
    }
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    
    if (validateStep2()) {
      const adminData = {
        dni: formData.dni,
        usuario_id_usuario: createdUserId
      };
      
      onSubmit(adminData);
    }
  };

  const renderStep1 = () => (
    <form className="create-form" onSubmit={handleStep1Submit}>
      <div className="step-indicator">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-label">Datos del Usuario</span>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">2</span>
          <span className="step-label">Datos del Administrador</span>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Información Personal</h3>
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
              placeholder="5-120 años"
              min="5"
              max="120"
            />
            {errors.edad && <span className="error-message">{errors.edad}</span>}
          </div>

          <div className="form-group form-group-full">
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
                placeholder="Mínimo 8 caracteres"
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
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn-cancel" onClick={onBack}>
          Cancelar
        </button>
        <button type="submit" className="btn-submit btn-submit-purple">
          <FaCheck />
          Continuar al Paso 2
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form className="create-form" onSubmit={handleStep2Submit}>
      <div className="step-indicator">
        <div className="step completed">
          <span className="step-number">1</span>
          <span className="step-label">Datos del Usuario</span>
        </div>
        <div className="step-line completed"></div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-label">Datos del Administrador</span>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Información Administrativa</h3>
        <div className="form-grid">
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
        
        <div className="success-message">
          <FaCheck />
          <span>Usuario creado exitosamente con ID: #{createdUserId}</span>
        </div>
      </div>

      <div className="form-footer">
        <button type="button" className="btn-cancel" onClick={() => setCurrentStep(1)}>
          <FaArrowLeft />
          Volver al Paso 1
        </button>
        <button type="submit" className="btn-submit btn-submit-purple" disabled={loading}>
          <FaSave />
          {loading ? 'Creando...' : 'Crear Administrador'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="create-form-container">
      <div className="form-header">
        <button className="btn-back" onClick={onBack}>
          <FaArrowLeft />
          Volver
        </button>
        <div className="form-title-section">
          <div className="form-icon form-icon-purple">
            <FaUserShield />
          </div>
          <div>
            <h2 className="form-title">Crear Administrador</h2>
            <p className="form-subtitle">Proceso en 2 pasos para crear un nuevo administrador</p>
          </div>
        </div>
      </div>

      {currentStep === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default CreateAdminForm;
