import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import AulasCard from "../../../components/Cards/AulasCard/AulasCard";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import Table from "../../../components/Table/Table";
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
                 <Table
  items={[
    { id: 1, nombre: "Actividad", email: "5 Grado C" },
    { id: 2, nombre: "Actividad",  email: "5 Grado C" },
  ]}
  tipo="usuarios"
  columns={[
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Aula", accessor: "email" },
  ]}
  onVer={(item) => console.log("Ver", item)}
  onEditar={(item) => console.log("Editar", item)}
  headerColor={gradients.redGradient.background}
/>
        </div>
      </div>
    </>
  );
}


