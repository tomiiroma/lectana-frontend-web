import React, { useState } from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaTimes } from 'react-icons/fa';
import './CreateUserModal.css';

const CreateUserModal = ({ isOpen, onClose, onSelectUserType }) => {
  if (!isOpen) return null;

  const userTypes = [
    {
      type: 'estudiante',
      title: 'Estudiante',
      description: 'Crear un nuevo estudiante para el sistema',
      icon: <FaUserGraduate />,
      color: 'blue',
      fields: ['Nombre', 'Apellido', 'Email', 'Edad (5-18)', 'Password', 'Aula (opcional)']
    },
    {
      type: 'docente',
      title: 'Docente',
      description: 'Crear un nuevo docente para el sistema',
      icon: <FaChalkboardTeacher />,
      color: 'green',
      fields: ['Nombre', 'Apellido', 'Email', 'Edad (18-80)', 'Password', 'DNI', 'Institución', 'Nivel educativo', 'Teléfono (opcional)']
    },
    {
      type: 'administrador',
      title: 'Administrador',
      description: 'Crear un nuevo administrador para el sistema',
      icon: <FaUserShield />,
      color: 'purple',
      fields: ['Nombre', 'Apellido', 'Email', 'Edad', 'Password', 'DNI']
    }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">¿Qué usuario deseas crear?</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          <p className="modal-description">
            Selecciona el tipo de usuario que deseas crear para continuar con el formulario correspondiente.
          </p>
          
          <div className="user-types-grid">
            {userTypes.map((userType) => (
              <div 
                key={userType.type}
                className={`user-type-card user-type-${userType.color}`}
                onClick={() => onSelectUserType(userType.type)}
              >
                <div className="user-type-icon">
                  {userType.icon}
                </div>
                <div className="user-type-content">
                  <h3 className="user-type-title">{userType.title}</h3>
                  <p className="user-type-description">{userType.description}</p>
                  <div className="user-type-fields">
                    <span className="fields-label">Campos requeridos:</span>
                    <ul className="fields-list">
                      {userType.fields.map((field, index) => (
                        <li key={index}>{field}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
