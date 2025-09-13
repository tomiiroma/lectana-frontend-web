import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import AulasCard from "../../../components/Cards/AulasCard/AulasCard";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateCard from "../../../components/Cards/CreateCard/CreateCard";
import { gradients } from "../../../styles/Gradients";
import { statusStyles } from "../../../styles/statusStyle";
import "../AdminPages.css";
import "./Aulas.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaUsers, FaChalkboardTeacher, FaGraduationCap, FaClock } from "react-icons/fa";


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
          <h3 style={{marginBottom: '16px', color: '#8b5cf6', fontWeight: '600'}}>Resumen de Aulas</h3>
          <table className="admin-table aulas-table">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Grado</th>
                <th>Docente</th>
                <th>Estudiantes</th>
                <th>Progreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="aula-info">
                    <div className="aula-icon">🎒</div>
                    <div>
                      <div className="aula-name">Aventuras de Lectura</div>
                      <div className="aula-code">AULA-001</div>
                    </div>
                  </div>
                </td>
                <td>5° Grado A</td>
                <td>María González</td>
                <td>28</td>
                <td>
                  <div className="mini-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{width: '78%'}}></div>
                    </div>
                    <span>78%</span>
                  </div>
                </td>
                <td><span className="status-badge status-active">Activa</span></td>
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
                  <div className="aula-info">
                    <div className="aula-icon">✨</div>
                    <div>
                      <div className="aula-name">Cuentos Mágicos</div>
                      <div className="aula-code">AULA-002</div>
                    </div>
                  </div>
                </td>
                <td>3° Grado B</td>
                <td>Carlos Mendez</td>
                <td>24</td>
                <td>
                  <div className="mini-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{width: '92%'}}></div>
                    </div>
                    <span>92%</span>
                  </div>
                </td>
                <td><span className="status-badge status-active">Activa</span></td>
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


