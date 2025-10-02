import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import AulasCard from "../../../components/Cards/AulasCard/AulasCard";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import Table from "../../../components/Table/Table";
import { gradients } from "../../../styles/Gradients";
import { statusStyles } from "../../../styles/statusStyle";
import "../AdminPages.css";
import "./Aulas.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaUsers, FaChalkboardTeacher, FaGraduationCap, FaClock } from "react-icons/fa";
import BtnEdit from "../../../components/Buttons/ActionButtons/btnEdit";
import BtnDelete from "../../../components/Buttons/ActionButtons/btnDelete";
import BtnView from "../../../components/Buttons/ActionButtons/btnView";
export default function Aulas() {
  return (
    <>
      <h1 className="admin-page-title admin-aulas-title">🏫 Gestión de Aulas</h1>
      
        <AdminActionsBar btnTitle={"Nueva Aula"} placeholderTitle={"Filtrar por Codigo"} btnClassName="btnAdd" btnStyle={gradients.purpleGradient}/>


      <div className="admin-page-container admin-aulas-container">
        {/* Estadísticas de aulas */}
        <div className="stats-grid">

              <CardStats icon={<FaGraduationCap color="#8b5cf6"/>} number={"47"}label={"Aulas Activas"}/>
          <CardStats icon={<FaUsers color="#8b5cf6"/>} number={"1,284"}label={"Estudiantes"}/>
          <CardStats icon={<FaChalkboardTeacher color="#8b5cf6"/>} number={"52"}label={"Docentes"}/>
          <CardStats icon={<FaGraduationCap color="#8b5cf6"/>} number={"89"}label={"Usuarios Activos"}/>


 
        </div>

        {/* Vista de tarjetas de aulas */}
        <div className="aulas-grid">
          <AulasCard mainColor={gradients.purpleGradient} primaryBtn={"5 Grado A"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"Titulo Actividad"} description={"Descripcion Actividad"} firstItem={"Cantidad Alumnos"} secondItem={"Profesor"} progress={75}/>
          <AulasCard mainColor={gradients.purpleGradient} primaryBtn={"5 Grado A"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"Titulo Actividad"} description={"Descripcion Actividad"} firstItem={"Cantidad Alumnos"} secondItem={"Profesor"} progress={75}/>
          <AulasCard mainColor={gradients.purpleGradient} primaryBtn={"5 Grado A"} secondaryBtnColor={statusStyles.active} secondaryBtn={"Activo"} title={"Titulo Actividad"} description={"Descripcion Actividad"} firstItem={"Cantidad Alumnos"} secondItem={"Profesor"} progress={75}/>


        <CreateCard title={"Crear Nueva Aula"} text={"Configura un nuevo espacio de aprendizaje"} btnText={"Crear Aula"} theme="purple"/>

   
        </div>

        {/* Tabla resumen */}
        <div className="table-container" style={{marginTop: '32px'}}>
          <Table
  items={[
    { id: 1, nombre: "Agustín", email: "aguero@mail.com" },
    { id: 2, nombre: "Carla",  email: "carla@mail.com" },
  ]}
  tipo="usuarios"
  columns={[
    { header: "ID", accessor: "id" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Email", accessor: "email" },
  ]}
  onVer={(item) => console.log("Ver", item)}
  onEditar={(item) => console.log("Editar", item)}
  headerColor={gradients.purpleGradient.background}
/>

        </div>
      </div>
    </>
  );
}


