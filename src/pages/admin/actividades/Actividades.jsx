import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import AulasCard from "../../../components/Cards/AulasCard/AulasCard";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import { gradients } from "../../../styles/Gradients";
import { statusStyles } from "../../../styles/statusStyle";
import "../AdminPages.css";
import "./Actividades.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaClipboardList, FaQuestionCircle, FaCheckCircle, FaClock, FaUsers, FaChartBar } from "react-icons/fa";

export default function Actividades() {
  return (
    <>
      <h1 className="admin-page-title admin-actividades-title">🎯 Gestión de Actividades</h1>
      
          <AdminActionsBar btnTitle={"Nueva Actividad"} placeholderTitle={"Buscar Actividad..."} btnClassName="btnAdd" btnStyle={gradients.redGradient}/>

      <div className="admin-page-container admin-actividades-container">
        {/* Estadísticas de actividades */}
        <div className="stats-grid">

              <CardStats icon={<FaClipboardList color="#ef4444"/>} number={"89"}label={"Total Actividades"}/>
          <CardStats icon={<FaCheckCircle color="#ef4444"/>} number={"67"}label={"Estudiantes"}/>
          <CardStats icon={<FaClock color="#ef4444"/>} number={"15"}label={"En Progreso"}/>
          <CardStats icon={<FaChartBar color="#ef4444"/>} number={"8.4"}label={"Puntuación Media"}/>



      
        </div>

        {/* Filtros por tipo */}
        <div className="activity-filters">
          <button className="activity-filter active">Todas</button>
          <button className="activity-filter">Comprensión Lectora</button>
          <button className="activity-filter">Vocabulario</button>
          <button className="activity-filter">Gramática</button>
          <button className="activity-filter">Creatividad</button>
          <button className="activity-filter">Evaluaciones</button>
        </div>

        {/* Grid de actividades */}
        <div className="actividades-grid">

          <AulasCard mainColor={statusStyles.info} primaryBtn={"Creatividad"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"El Dragón y la Princesa"} description={"Actividad de comprensión lectora basada en el cuento clásico con preguntas interactivas."} firstItem={"12 preguntas"} secondItem={"15 minutos"} progress={85} IconFirstItem={FaQuestionCircle} IconSecondItem={FaClock}/>
          <AulasCard mainColor={statusStyles.info} primaryBtn={"Creatividad"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"El Dragón y la Princesa"} description={"Actividad de comprensión lectora basada en el cuento clásico con preguntas interactivas."} firstItem={"12 preguntas"} secondItem={"15 minutos"} progress={85} IconFirstItem={FaQuestionCircle} IconSecondItem={FaClock}/>
          <AulasCard mainColor={statusStyles.info} primaryBtn={"Creatividad"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"El Dragón y la Princesa"} description={"Actividad de comprensión lectora basada en el cuento clásico con preguntas interactivas."} firstItem={"12 preguntas"} secondItem={"15 minutos"} progress={85} IconFirstItem={FaQuestionCircle} IconSecondItem={FaClock}/>



        <CreateCard title={"Crear Nueva Actividad"} text={"Diseña una nueva actividad educativa personalizada"} btnText={"Crear Actividad"} theme="red"/>
     
        </div>

        {/* Tabla de rendimiento */}
        <div className="table-container" style={{marginTop: '32px'}}>
          <h3 style={{marginBottom: '16px', color: '#ef4444', fontWeight: '600'}}>Rendimiento por Actividad</h3>
          <table className="admin-table actividades-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Participantes</th>
                <th>Tasa de Éxito</th>
                <th>Tiempo Promedio</th>
                <th>Puntuación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="actividad-info">
                    <div className="actividad-icon">📖</div>
                    <div>
                      <div className="actividad-name">El Dragón y la Princesa</div>
                      <div className="actividad-code">ACT-001</div>
                    </div>
                  </div>
                </td>
                <td><span className="type-badge type-comprension">Comprensión</span></td>
                <td>156</td>
                <td>
                  <div className="success-rate">
                    <div className="rate-bar">
                      <div className="rate-fill" style={{width: '85%'}}></div>
                    </div>
                    <span>85%</span>
                  </div>
                </td>
                <td>12 min</td>
                <td>
                  <div className="score-display">8.5/10</div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="actividad-info">
                    <div className="actividad-icon">✨</div>
                    <div>
                      <div className="actividad-name">Palabras Mágicas</div>
                      <div className="actividad-code">ACT-002</div>
                    </div>
                  </div>
                </td>
                <td><span className="type-badge type-vocabulario">Vocabulario</span></td>
                <td>203</td>
                <td>
                  <div className="success-rate">
                    <div className="rate-bar">
                      <div className="rate-fill" style={{width: '92%'}}></div>
                    </div>
                    <span>92%</span>
                  </div>
                </td>
                <td>8 min</td>
                <td>
                  <div className="score-display">9.2/10</div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


