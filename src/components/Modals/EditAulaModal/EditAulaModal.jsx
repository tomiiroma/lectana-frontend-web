import { useState, useEffect } from "react";
import { obtenerAulaPorId, editarAula, asignarEstudiantesAula, asignarCuentosAula } from "../../../api/aulas";
import { obtenerTodosLosCuentos } from "../../../api/cuentos";
import { obtenerTodosLosDocentes } from "../../../api/docentes";
import { obtenerTodosLosAlumnos } from "../../../api/alumnos";
import "./EditAulaModal.css";

function EditAulaModal({ isOpen, onClose, aulaId, onUpdated }) {
  const [formData, setFormData] = useState({
    nombre_aula: "",
    grado: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(false);
  
  // Estados para la configuración
  const [step, setStep] = useState(1);
  const [aula, setAula] = useState(null);
  const [cuentos, setCuentos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedCuentos, setSelectedCuentos] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);

  useEffect(() => {
    if (isOpen && aulaId) {
      fetchAulaData();
    }
  }, [isOpen, aulaId]);


  const fetchAulaData = async () => {
    setInitialLoading(true);
    setErrors({});
    try {
      console.log(`Obteniendo datos del aula ${aulaId} para editar...`);
      
      // Obtener datos en paralelo
      const [aulaData, cuentosData, docentesData, estudiantesData] = await Promise.all([
        obtenerAulaPorId(aulaId).catch(err => {
          console.error("❌ Error obteniendo aula:", err);
          return null;
        }),
        obtenerTodosLosCuentos().catch(err => {
          console.error("❌ Error obteniendo cuentos:", err);
          return null;
        }),
        obtenerTodosLosDocentes().catch(err => {
          console.error("❌ Error obteniendo docentes:", err);
          return null;
        }),
        obtenerTodosLosAlumnos().catch(err => {
          console.error("❌ Error obteniendo estudiantes:", err);
          return null;
        })
      ]);
      
      console.log("Datos obtenidos para editar:", { aulaData, cuentosData, docentesData, estudiantesData });
      
      // Configurar datos básicos
      setFormData({
        nombre_aula: aulaData?.nombre_aula || "",
        grado: aulaData?.grado || ""
      });
      
      setAula(aulaData);
      
      // Extraer arrays de la estructura { ok: true, data: [...] }
      const cuentosArray = cuentosData?.ok ? cuentosData.data : (cuentosData || []);
      const docentesArray = docentesData?.ok ? docentesData.data : (docentesData || []);
      const estudiantesArray = estudiantesData?.ok ? estudiantesData.data : (estudiantesData || []);
      
      setCuentos(cuentosArray);
      setDocentes(docentesArray);
      setEstudiantes(estudiantesArray);
      
      console.log("📚 Cuentos cargados:", cuentosArray);
      console.log("👨‍🏫 Docentes cargados:", docentesArray);
      console.log("👨‍🎓 Estudiantes cargados:", estudiantesArray);
      
      // Configurar selecciones actuales (si el aula ya tiene asignaciones)
      console.log("🔍 Configurando selecciones actuales:", {
        cuentosAsignados: aulaData?.cuentos || [],
        docenteAsignado: aulaData?.docente_id_docente,
        estudiantesAsignados: aulaData?.estudiantes || []
      });
      
      // Cargar cuentos ya asignados
      const cuentosAsignados = aulaData?.cuentos?.map(cuento => cuento.id) || [];
      setSelectedCuentos(cuentosAsignados);
      
      // Cargar docente ya asignado
      setSelectedDocente(aulaData?.docente_id_docente || null);
      
      // Cargar estudiantes ya asignados
      const estudiantesAsignados = aulaData?.estudiantes?.map(estudiante => estudiante.id) || [];
      setSelectedEstudiantes(estudiantesAsignados);
      
      console.log("✅ Selecciones configuradas:", {
        selectedCuentos: cuentosAsignados,
        selectedDocente: aulaData?.docente_id_docente,
        selectedEstudiantes: estudiantesAsignados
      });
      
    } catch (error) {
      console.error("Error obteniendo datos del aula:", error);
      setErrors({ general: "Error al cargar los datos del aula" });
    } finally {
      setInitialLoading(false);
    }
  };

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

  // Funciones para manejar selecciones
  const handleCuentoToggle = (cuentoId) => {
    setSelectedCuentos(prev => 
      prev.includes(cuentoId) 
        ? prev.filter(id => id !== cuentoId)
        : [...prev, cuentoId]
    );
  };

  const handleDocenteSelect = (docenteId) => {
    setSelectedDocente(docenteId);
  };

  const handleEstudianteToggle = (estudianteId) => {
    setSelectedEstudiantes(prev => 
      prev.includes(estudianteId) 
        ? prev.filter(id => id !== estudianteId)
        : [...prev, estudianteId]
    );
  };

  // Navegación entre pasos
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
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
    
    if (step === 1) {
      // Validar datos básicos
      if (!validateForm()) {
        return;
      }
      handleNextStep();
      return;
    }
    
    if (step === 2) {
      // Paso 2: Cuentos - No requiere validación específica, puede continuar sin seleccionar
      console.log("📚 Pasando del paso 2 al 3. Cuentos seleccionados:", selectedCuentos);
      handleNextStep();
      return;
    }
    
    if (step === 3) {
      // Paso 3: Docente - No requiere validación específica, puede continuar sin seleccionar
      console.log("👨‍🏫 Pasando del paso 3 al 4. Docente seleccionado:", selectedDocente);
      handleNextStep();
      return;
    }
    
    if (step === 4) {
      // Guardar todos los cambios
      setLoading(true);
      try {
        console.log(`Editando aula ${aulaId} con datos:`, {
          formData,
          selectedCuentos,
          selectedDocente,
          selectedEstudiantes
        });
        
        // Actualizar datos básicos y docente asignado
        console.log("👨‍🏫 Enviando docente_id_docente:", selectedDocente);
        const aulaEditada = await editarAula({
          id: aulaId,
          ...formData,
          docente_id_docente: selectedDocente
        });
        console.log("Aula editada exitosamente:", aulaEditada);
        
        // Asignar cuentos al aula (siempre enviar, incluso array vacío para desasignar)
        console.log("📚 Asignando cuentos:", selectedCuentos);
        await asignarCuentosAula({
          aulaId,
          cuentosIds: selectedCuentos
        });
        console.log("Cuentos asignados exitosamente");
        
        // Asignar estudiantes al aula (siempre enviar, incluso array vacío para desasignar)
        console.log("👨‍🎓 Asignando estudiantes:", selectedEstudiantes);
        await asignarEstudiantesAula({
          aulaId,
          estudiantesIds: selectedEstudiantes
        });
        console.log("Estudiantes asignados exitosamente");
        
        // Cerrar modal y notificar
        onClose();
        onUpdated?.(aulaEditada);
        
      } catch (error) {
        console.error("Error editando aula:", error);
        
        // Mostrar mensaje específico del backend si está disponible
        let errorMessage = "Error al editar el aula. Inténtalo de nuevo.";
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setErrors({ general: errorMessage });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (!loading && !initialLoading) {
      setFormData({ nombre_aula: "", grado: "" });
      setErrors({});
      setStep(1);
      setSelectedCuentos([]);
      setSelectedDocente(null);
      setSelectedEstudiantes([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">✏️</div>
            <h2 className="modal-title">Editar Aula: {aula?.nombre_aula}</h2>
          </div>
          <button className="modal-close" onClick={handleClose} disabled={loading || initialLoading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {initialLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando datos del aula...</p>
            </div>
          ) : (
            <>
              {/* Indicador de pasos */}
              <div className="steps-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Información</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Cuentos</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Docente</span>
                </div>
                <div className={`step ${step >= 4 ? 'active' : ''}`}>
                  <span className="step-number">4</span>
                  <span className="step-label">Estudiantes</span>
                </div>
              </div>

              {/* Contenido del paso actual */}
              <div className="step-content">
                {step === 1 && (
                  <div className="step-panel">
                    <h3>📝 Información Básica</h3>
                    <p>Edita los datos básicos del aula</p>
                    <form onSubmit={handleSubmit} className="edit-form">
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
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-panel">
                    <h3>📚 Cuentos Asignados</h3>
                    <p>Selecciona los cuentos disponibles en esta aula</p>
                    {!cuentos || !Array.isArray(cuentos) || cuentos.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay cuentos disponibles</p>
                      </div>
                    ) : (
                      <div className="items-grid">
                        {cuentos.map((cuento) => (
                          <div 
                            key={cuento.id_cuento}
                            className={`item-card ${selectedCuentos.includes(cuento.id_cuento) ? 'selected' : ''}`}
                            onClick={() => handleCuentoToggle(cuento.id_cuento)}
                          >
                            <div className="item-icon">📖</div>
                            <div className="item-content">
                              <div className="item-title">{cuento.titulo}</div>
                              <div className="item-subtitle">Edad: {cuento.edad_publico} años</div>
                            </div>
                            <div className="item-checkbox">
                              {selectedCuentos.includes(cuento.id_cuento) && '✓'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="step-panel">
                    <h3>👨‍🏫 Docente Asignado</h3>
                    <p>Selecciona el docente responsable de esta aula</p>
                    {!docentes || !Array.isArray(docentes) || docentes.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay docentes disponibles</p>
                      </div>
                    ) : (
                      <div className="items-grid">
                        {docentes.map((docente) => (
                          <div 
                            key={docente.id_docente}
                            className={`item-card radio-card ${selectedDocente === docente.id_docente ? 'selected' : ''}`}
                            onClick={() => handleDocenteSelect(docente.id_docente)}
                          >
                            <div className="item-icon">👨‍🏫</div>
                            <div className="item-content">
                              <div className="item-title">
                                {docente.usuario?.nombre || docente.nombre || 'Sin nombre'} {docente.usuario?.apellido || docente.apellido || 'Sin apellido'}
                              </div>
                              <div className="item-subtitle">{docente.usuario?.email || docente.email || docente.nivel_educativo}</div>
                            </div>
                            <div className="item-radio">
                              {selectedDocente === docente.id_docente && '●'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="step-panel">
                    <h3>👨‍🎓 Estudiantes Inscritos</h3>
                    <p>Selecciona los estudiantes que participarán en esta aula</p>
                    {!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay estudiantes disponibles</p>
                      </div>
                    ) : (
                      <div className="items-grid">
                        {estudiantes.map((estudiante) => (
                          <div 
                            key={estudiante.id_alumno}
                            className={`item-card ${selectedEstudiantes.includes(estudiante.id_alumno) ? 'selected' : ''}`}
                            onClick={() => handleEstudianteToggle(estudiante.id_alumno)}
                          >
                            <div className="item-icon">👨‍🎓</div>
                            <div className="item-content">
                              <div className="item-title">
                                {estudiante.usuario?.nombre || estudiante.nombre || 'Sin nombre'} {estudiante.usuario?.apellido || estudiante.apellido || 'Sin apellido'}
                              </div>
                              <div className="item-subtitle">{estudiante.usuario?.email || estudiante.email || estudiante.nacionalidad}</div>
                            </div>
                            <div className="item-checkbox">
                              {selectedEstudiantes.includes(estudiante.id_alumno) && '✓'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="error-banner">
                  <div className="error-icon">⚠️</div>
                  <span>{errors.general}</span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-cancel" 
            onClick={step === 1 ? handleClose : handlePreviousStep}
            disabled={loading || initialLoading}
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          <button 
            className="btn-submit" 
            onClick={handleSubmit}
            disabled={loading || initialLoading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Guardando...
              </>
            ) : step === 4 ? (
              "Guardar Cambios"
            ) : (
              "Siguiente"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditAulaModal;
