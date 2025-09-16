import { useState, useEffect } from "react";
import { obtenerAulaPorId, editarAula, asignarEstudiantesAula, asignarCuentosAula } from "../../../api/aulas";
import { obtenerTodosLosCuentos } from "../../../api/cuentos";
import { listarAutores } from "../../../api/autores";
import { listarGeneros } from "../../../api/generos";
import { obtenerTodosLosDocentes } from "../../../api/docentes";
import { obtenerTodosLosAlumnos } from "../../../api/alumnos";
import "./ConfigureAulaModal.css";

function ConfigureAulaModal({ isOpen, onClose, aulaId, onConfigured }) {
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Cuentos, 2: Docentes, 3: Estudiantes
  
  // Datos disponibles
  const [cuentos, setCuentos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  
  // Selecciones
  const [selectedCuentos, setSelectedCuentos] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState(null); // Solo un docente
  const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);

  useEffect(() => {
    if (isOpen && aulaId) {
      fetchInitialData();
    }
  }, [isOpen, aulaId]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(`Configurando aula ${aulaId}...`);
      
      // Obtener datos en paralelo
      console.log("🔄 Iniciando llamadas a APIs...");
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
      
      console.log("✅ Todas las APIs completadas");

      setAula(aulaData);
      setCuentos(cuentosData || []);
      
      // Estructura confirmada: { ok: true, data: [...] }
      console.log("🔍 DATOS RECIBIDOS DE LAS APIs:");
      console.log("📚 Cuentos:", cuentosData);
      console.log("👨‍🏫 Docentes:", docentesData);
      console.log("👨‍🎓 Estudiantes:", estudiantesData);
      
      // DEBUGGING DETALLADO
      console.log("🔍 DEBUGGING DETALLADO:");
      console.log("cuentosData type:", typeof cuentosData);
      console.log("cuentosData.ok:", cuentosData?.ok);
      console.log("cuentosData.data:", cuentosData?.data);
      console.log("cuentosData.data type:", typeof cuentosData?.data);
      console.log("cuentosData.data isArray:", Array.isArray(cuentosData?.data));
      
      console.log("docentesData type:", typeof docentesData);
      console.log("docentesData.ok:", docentesData?.ok);
      console.log("docentesData.data:", docentesData?.data);
      console.log("docentesData.data type:", typeof docentesData?.data);
      console.log("docentesData.data isArray:", Array.isArray(docentesData?.data));
      
      console.log("estudiantesData type:", typeof estudiantesData);
      console.log("estudiantesData.ok:", estudiantesData?.ok);
      console.log("estudiantesData.data:", estudiantesData?.data);
      console.log("estudiantesData.data type:", typeof estudiantesData?.data);
      console.log("estudiantesData.data isArray:", Array.isArray(estudiantesData?.data));
      
      // Extraer arrays de la estructura { ok: true, data: [...] }
      const cuentosArray = cuentosData?.ok ? cuentosData.data : (cuentosData || []);
      const docentesArray = docentesData?.ok ? docentesData.data : (docentesData || []);
      const estudiantesArray = estudiantesData?.ok ? estudiantesData.data : (estudiantesData || []);
      
      console.log("✅ Estructura confirmada: { ok: true, data: [...] }");
      console.log("📚 Cuentos extraídos:", cuentosArray.length);
      console.log("👨‍🏫 Docentes extraídos:", docentesArray.length);
      console.log("👨‍🎓 Estudiantes extraídos:", estudiantesArray.length);
      
      setCuentos(cuentosArray);
      setDocentes(docentesArray);
      setEstudiantes(estudiantesArray);

      console.log("📊 DATOS FINALES CARGADOS:");
      console.log("🏫 Aula:", aulaData);
      console.log("📚 Cuentos cargados:", cuentosArray.length, cuentosArray);
      console.log("👨‍🏫 Docentes cargados:", docentesArray.length, docentesArray);
      console.log("👨‍🎓 Estudiantes cargados:", estudiantesArray.length, estudiantesArray);
      
      // Verificar que los arrays sean realmente arrays
      console.log("🔍 VERIFICACIÓN DE TIPOS:");
      console.log("cuentos es array:", Array.isArray(cuentosArray));
      console.log("docentes es array:", Array.isArray(docentesArray));
      console.log("estudiantes es array:", Array.isArray(estudiantesArray));
      
      // Mostrar ejemplos de los primeros elementos
      if (cuentosArray.length > 0) {
        console.log("📚 Ejemplo cuento:", cuentosArray[0]);
      }
      if (docentesArray.length > 0) {
        console.log("👨‍🏫 Ejemplo docente:", docentesArray[0]);
      }
      if (estudiantesArray.length > 0) {
        console.log("👨‍🎓 Ejemplo estudiante:", estudiantesArray[0]);
      }
    } catch (error) {
      console.error("Error cargando datos para configuración:", error);
      setError("Error al cargar los datos necesarios");
    } finally {
      setLoading(false);
    }
  };

  const handleCuentoToggle = (cuentoId) => {
    setSelectedCuentos(prev => 
      prev.includes(cuentoId) 
        ? prev.filter(id => id !== cuentoId)
        : [...prev, cuentoId]
    );
  };

  const handleDocenteSelect = (docenteId) => {
    // Solo permitir un docente seleccionado
    setSelectedDocente(selectedDocente === docenteId ? null : docenteId);
  };

  const handleEstudianteToggle = (estudianteId) => {
    setSelectedEstudiantes(prev => 
      prev.includes(estudianteId) 
        ? prev.filter(id => id !== estudianteId)
        : [...prev, estudianteId]
    );
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      console.log("Finalizando configuración del aula:", {
        aulaId,
        cuentos: selectedCuentos,
        docente: selectedDocente,
        estudiantes: selectedEstudiantes
      });

      // Asignar docente al aula
      if (selectedDocente) {
        console.log("👨‍🏫 Asignando docente:", selectedDocente);
        await editarAula({
          id: aulaId,
          nombre_aula: aula?.nombre_aula || "",
          grado: aula?.grado || "",
          docente_id_docente: selectedDocente
        });
        console.log("Docente asignado exitosamente");
      }
      
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
      
      onConfigured?.({
        aulaId,
        cuentos: selectedCuentos,
        docente: selectedDocente,
        estudiantes: selectedEstudiantes
      });
      
    } catch (error) {
      console.error("Error finalizando configuración:", error);
      
      // Mostrar mensaje específico del backend si está disponible
      let errorMessage = "Error al finalizar la configuración";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAula(null);
      setError("");
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
      <div className="modal-content configure-aula-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Configurar Aula: {aula?.nombre_aula}</h2>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading && step === 1 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Cargando datos...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="btn-retry" onClick={fetchInitialData}>
                Reintentar
              </button>
            </div>
          ) : (
            <>
              {/* Indicador de pasos */}
              <div className="steps-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Cuentos</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Docentes</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Estudiantes</span>
                </div>
              </div>

              {/* Contenido del paso actual */}
              <div className="step-content">
                {step === 1 && (
                  <div className="step-panel">
                    <h3>📚 Seleccionar Cuentos</h3>
                    <p>Elige los cuentos que estarán disponibles en esta aula</p>
                    {!cuentos || !Array.isArray(cuentos) || cuentos.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay cuentos disponibles</p>
                        <p style={{fontSize: '12px', color: '#999'}}>
                          Debug: cuentos = {JSON.stringify(cuentos)}
                        </p>
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

                {step === 2 && (
                  <div className="step-panel">
                    <h3>👨‍🏫 Seleccionar Docente</h3>
                    <p>Asigna el docente que trabajará en esta aula (solo uno)</p>
                    {!docentes || !Array.isArray(docentes) || docentes.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay docentes disponibles</p>
                        <p style={{fontSize: '12px', color: '#999'}}>
                          Debug: docentes = {JSON.stringify(docentes)}
                        </p>
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

                {step === 3 && (
                  <div className="step-panel">
                    <h3>👨‍🎓 Seleccionar Estudiantes</h3>
                    <p>Inscribe los estudiantes que participarán en esta aula</p>
                    {!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0 ? (
                      <div className="empty-state">
                        <p>No hay estudiantes disponibles</p>
                        <p style={{fontSize: '12px', color: '#999'}}>
                          Debug: estudiantes = {JSON.stringify(estudiantes)}
                        </p>
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
            </>
          )}
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={step === 1 ? handleClose : handlePreviousStep}
            disabled={loading}
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleNextStep}
            disabled={loading}
          >
            {loading ? 'Procesando...' : step === 3 ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfigureAulaModal;
