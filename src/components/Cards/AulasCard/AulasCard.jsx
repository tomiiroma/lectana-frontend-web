import { useState, useEffect } from "react";
import { FaChalkboardTeacher, FaEdit, FaEye, FaUsers, FaBook, FaKey } from "react-icons/fa";
import { obtenerAulaPorId } from "../../../api/aulas";
import "./AulasCard.css";

function AulasCard({ aula, onView, onEdit }) {
  const [aulaCompleta, setAulaCompleta] = useState(aula || {});
  const [loadingCompleta, setLoadingCompleta] = useState(false);
  
  const docenteId = aulaCompleta?.docente_id_docente ?? null;
  const hasDocente = docenteId !== null && docenteId !== undefined;
  const docenteName = aulaCompleta?.docente ? `${aulaCompleta.docente?.nombre || 'Docente'} ${aulaCompleta.docente?.apellido || ''}` : 'Sin asignar';
  
  // Obtener datos completos de la aula si no los tenemos
  useEffect(() => {
    const obtenerDatosCompletos = async () => {
      if (!aula?.id_aula) return;
      // Solo hacer la llamada si no tenemos los datos completos
      if (aulaCompleta?.total_estudiantes === undefined && aulaCompleta?.total_cuentos === undefined) {
        setLoadingCompleta(true);
        try {
          const datosCompletos = await obtenerAulaPorId(aula.id_aula);
          setAulaCompleta(datosCompletos || aula || {});
          console.log("AulasCard - Datos completos obtenidos:", datosCompletos);
        } catch (error) {
          console.error("Error obteniendo datos completos del aula:", error);
        } finally {
          setLoadingCompleta(false);
        }
      }
    };
    
    obtenerDatosCompletos();
  }, [aula?.id_aula, aulaCompleta?.total_estudiantes, aulaCompleta?.total_cuentos]);
  
  // Debug: Ver qué datos están llegando
  console.log("AulasCard - Datos del aula:", {
    id: aulaCompleta?.id_aula,
    nombre: aulaCompleta?.nombre_aula,
    hasDocente,
    docente_id: docenteId,
    total_estudiantes: aulaCompleta?.total_estudiantes,
    total_cuentos: aulaCompleta?.total_cuentos,
    estudiantes: aulaCompleta?.estudiantes,
    cuentos: aulaCompleta?.cuentos
  });
  
  // Calcular porcentaje de configuración basado en todos los elementos
  const calculateConfigPercentage = () => {
    let percentage = 0;
    
    // Docente asignado: 40%
    if (hasDocente) {
      percentage += 40;
    }
    
    // Estudiantes asignados: 30%
    // Priorizar total_estudiantes si está disponible, sino usar el array
    const estudiantesCount = aulaCompleta?.total_estudiantes !== undefined 
      ? aulaCompleta.total_estudiantes 
      : (aulaCompleta?.estudiantes?.length || 0);
    
    if (estudiantesCount > 0) {
      percentage += 30;
    }
    
    // Cuentos asignados: 30%
    // Priorizar total_cuentos si está disponible, sino usar el array
    const cuentosCount = aulaCompleta?.total_cuentos !== undefined 
      ? aulaCompleta.total_cuentos 
      : (aulaCompleta?.cuentos?.length || 0);
    
    if (cuentosCount > 0) {
      percentage += 30;
    }
    
    console.log("Cálculo de porcentaje:", {
      hasDocente,
      estudiantesCount,
      cuentosCount,
      percentage,
      tieneTotalEstudiantes: aulaCompleta?.total_estudiantes !== undefined,
      tieneTotalCuentos: aulaCompleta?.total_cuentos !== undefined,
      tieneArrayEstudiantes: !!aulaCompleta?.estudiantes,
      tieneArrayCuentos: !!aulaCompleta?.cuentos,
      loadingCompleta
    });
    
    return Math.min(percentage, 100);
  };
  
  const configPercentage = calculateConfigPercentage();
  
  // Determinar clase CSS según porcentaje
  const getProgressClass = () => {
    if (configPercentage <= 30) return 'progress-low';
    if (configPercentage <= 60) return 'progress-medium';
    if (configPercentage <= 90) return 'progress-high';
    return 'progress-complete';
  };
  
  return (
    <div className="aula-card">
      <div className="aula-header">
        <div className="aula-grade">{aulaCompleta?.grado || 'Sin grado'}</div>
        <div className={`aula-status ${hasDocente ? 'status-assigned' : 'status-unassigned'}`}>
          {hasDocente ? 'Con Docente' : 'Sin Docente'}
        </div>
      </div>
      
      <div className="aula-content">
        <h3 className="aula-title">{aulaCompleta?.nombre_aula || 'Sin nombre'}</h3>
        
        <div className="aula-code">
          <FaKey className="code-icon" />
          <span className="code-text">{aulaCompleta?.codigo_acceso || 'No generado'}</span>
        </div>
        
        <div className="aula-stats">
          <div className="aula-stat">
            <FaChalkboardTeacher className="stat-icon-small" />
            <span>{docenteName}</span>
          </div>
          <div className="aula-stat">
            <FaUsers className="stat-icon-small" />
            <span>{aulaCompleta?.total_estudiantes || aulaCompleta?.estudiantes?.length || 0} estudiantes</span>
          </div>
        </div>
        
        <div className={`aula-progress ${getProgressClass()}`}>
          <div className="progress-label">
            Configuración
            {loadingCompleta && <span className="loading-indicator">⏳</span>}
          </div>
          <div className="progress-bar">
            <div className={`progress-fill ${getProgressClass()}`} style={{ 
              width: `${configPercentage}%` 
            }}></div>
          </div>
          <span className="progress-text">{configPercentage}%</span>
        </div>
      </div>
      
      <div className="aula-actions">
        <button className="btn-action btn-view" title="Ver Detalles" onClick={() => onView(aulaCompleta?.id_aula || aula?.id_aula)}>
          <FaEye />
        </button>
        <button className="btn-action btn-edit" title="Editar" onClick={() => onEdit(aulaCompleta?.id_aula || aula?.id_aula)}>
          <FaEdit />
        </button>
      </div>
    </div>
  );
}

export default AulasCard;
