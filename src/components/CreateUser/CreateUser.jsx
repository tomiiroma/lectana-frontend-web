import React, { useState, useEffect, useRef } from 'react';
import CreateUserModal from '../Modals/CreateUserModal/CreateUserModal';
import CreateStudentForm from '../Forms/CreateStudentForm/CreateStudentForm';
import CreateTeacherForm from '../Forms/CreateTeacherForm/CreateTeacherForm';
import CreateAdminForm from '../Forms/CreateAdminForm/CreateAdminForm';
import { crearAlumno } from '../../api/alumnos';
import { crearDocente } from '../../api/docentes';
import { crearUsuario, crearAdministrador } from '../../api/usuarios';

const CreateUser = ({ isOpen, onClose, onUserCreated }) => {
  const [currentView, setCurrentView] = useState('modal'); // 'modal', 'student', 'teacher', 'admin'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  // Efecto para hacer scroll automático cuando cambie la vista
  useEffect(() => {
    if (currentView !== 'modal' && formRef.current) {
      setTimeout(() => {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [currentView]);

  // Efecto para resetear el estado cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('modal');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    console.log('🔄 Cerrando modal...');
    setCurrentView('modal');
    setError(null);
    onClose();
  };

  const handleSelectUserType = (userType) => {
    setCurrentView(userType);
    setError(null);
    
    // Scroll automático hacia el formulario después de un pequeño delay
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleBackToModal = () => {
    setCurrentView('modal');
    setError(null);
  };

  const handleCreateStudent = async (studentData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Creando estudiante:', studentData);
      const result = await crearAlumno(studentData);
      console.log('✅ Estudiante creado:', result);
      
      // Notificar éxito y cerrar
      onUserCreated('estudiante', result);
      handleClose();
      
    } catch (err) {
      console.error('❌ Error creando estudiante:', err);
      setError(err.message || 'Error al crear el estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (teacherData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Creando docente:', teacherData);
      const result = await crearDocente(teacherData);
      console.log('✅ Docente creado:', result);
      
      // Notificar éxito y cerrar
      onUserCreated('docente', result);
      handleClose();
      
    } catch (err) {
      console.error('❌ Error creando docente:', err);
      setError(err.message || 'Error al crear el docente');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (adminData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Creando administrador:', adminData);
      const result = await crearAdministrador(adminData);
      console.log('✅ Administrador creado:', result);
      
      // Notificar éxito y cerrar
      onUserCreated('administrador', result);
      handleClose();
      
    } catch (err) {
      console.error('❌ Error creando administrador:', err);
      setError(err.message || 'Error al crear el administrador');
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'modal':
        return (
          <CreateUserModal
            isOpen={isOpen}
            onClose={handleClose}
            onSelectUserType={handleSelectUserType}
          />
        );
      
      case 'estudiante':
        return (
          <div ref={formRef}>
            <CreateStudentForm
              onBack={handleBackToModal}
              onSubmit={handleCreateStudent}
              loading={loading}
            />
          </div>
        );
      
      case 'docente':
        return (
          <div ref={formRef}>
            <CreateTeacherForm
              onBack={handleBackToModal}
              onSubmit={handleCreateTeacher}
              loading={loading}
            />
          </div>
        );
      
      case 'administrador':
        return (
          <div ref={formRef}>
            <CreateAdminForm
              onBack={handleBackToModal}
              onSubmit={handleCreateAdmin}
              loading={loading}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-user-overlay">
      {renderCurrentView()}
      
      {/* Error Message */}
      {error && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;
