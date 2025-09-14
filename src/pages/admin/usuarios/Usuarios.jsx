import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Usuarios.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload, FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";
import { MdLibraryAddCheck } from "react-icons/md";
import { obtenerDocentes } from "../../../api/docentes";
import { obtenerAlumnos } from "../../../api/alumnos";
import { obtenerAdministradores } from "../../../api/administradores";
import { useEffect, useState } from "react";

export default function Usuarios() {
  const [docentesData, setDocentesData] = useState(null);
  const [alumnosData, setAlumnosData] = useState(null);
  const [administradoresData, setAdministradoresData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("Estudiantes");

  // Función para probar la conexión con docentes
  const probarConexionDocentes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Probando conexión con docentes...");
      
      const data = await obtenerDocentes({
        page: 1,
        limit: 5
      });
      
      console.log("✅ Datos recibidos:", data);
      setDocentesData(data);
      
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener alumnos
  const obtenerAlumnosData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo alumnos...");
      
      const data = await obtenerAlumnos({
        page: 1,
        limit: 10
      });
      
      console.log("✅ Datos de alumnos recibidos:", data);
      setAlumnosData(data);
      
    } catch (err) {
      console.error("❌ Error obteniendo alumnos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener administradores
  const obtenerAdministradoresData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo administradores...");
      
      const data = await obtenerAdministradores({
        page: 1,
        limit: 10
      });
      
      console.log("✅ Datos de administradores recibidos:", data);
      setAdministradoresData(data);
      
    } catch (err) {
      console.error("❌ Error obteniendo administradores:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la prueba al cargar el componente
  useEffect(() => {
    probarConexionDocentes();
    obtenerAlumnosData();
    obtenerAdministradoresData();
  }, []);

  // Función para generar iniciales del nombre
  const generarIniciales = (nombre, apellido) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  // Función para renderizar las filas de la tabla según el filtro
  const renderizarFilasTabla = () => {
    if (filtroActivo === "Docentes" && docentesData?.items) {
      return docentesData.items.map((docente) => (
        <tr key={docente.id_docente}>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-green">
                {generarIniciales(docente.usuario.nombre, docente.usuario.apellido)}
              </div>
              <div>
                <div className="user-name">
                  {docente.usuario.nombre} {docente.usuario.apellido}
                </div>
                <div className="user-id">ID: #{docente.id_docente}</div>
              </div>
            </div>
          </td>
          <td>{docente.usuario.email}</td>
          <td><span className="role-badge role-teacher">Docente</span></td>
          <td>
            <span className={`status-badge ${docente.usuario.activo ? 'status-active' : 'status-inactive'}`}>
              {docente.usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td>{docente.institucion_nombre}</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    if (filtroActivo === "Estudiantes" && alumnosData?.items) {
      return alumnosData.items.map((alumno) => (
        <tr key={alumno.id_alumno}>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-blue">
                {generarIniciales(alumno.usuario.nombre, alumno.usuario.apellido)}
              </div>
              <div>
                <div className="user-name">
                  {alumno.usuario.nombre} {alumno.usuario.apellido}
                </div>
                <div className="user-id">ID: #{alumno.id_alumno}</div>
              </div>
            </div>
          </td>
          <td>{alumno.usuario.email}</td>
          <td><span className="role-badge role-student">Estudiante</span></td>
          <td>
            <span className={`status-badge ${alumno.usuario.activo ? 'status-active' : 'status-inactive'}`}>
              {alumno.usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td>Aula #{alumno.aula_id_aula}</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    if (filtroActivo === "Administradores" && administradoresData?.items) {
      return administradoresData.items.map((administrador) => (
        <tr key={administrador.id_administrador}>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-purple">
                {generarIniciales(administrador.usuario.nombre, administrador.usuario.apellido)}
              </div>
              <div>
                <div className="user-name">
                  {administrador.usuario.nombre} {administrador.usuario.apellido}
                </div>
                <div className="user-id">ID: #{administrador.id_administrador}</div>
              </div>
            </div>
          </td>
          <td>{administrador.usuario.email}</td>
          <td><span className="role-badge role-admin">Administrador</span></td>
          <td>
            <span className={`status-badge ${administrador.usuario.activo ? 'status-active' : 'status-inactive'}`}>
              {administrador.usuario.activo ? 'Activo' : 'Inactivo'}
            </span>
          </td>
          <td>DNI: {administrador.dni}</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    // Datos hardcodeados para filtros sin implementar (por ahora)
    return (
      <>
        <tr>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-green">MG</div>
              <div>
                <div className="user-name">María González</div>
                <div className="user-id">ID: #USR001</div>
              </div>
            </div>
          </td>
          <td>maria.gonzalez@email.com</td>
          <td><span className="role-badge role-teacher">Docente</span></td>
          <td><span className="status-badge status-active">Activo</span></td>
          <td>Hace 2 horas</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-blue">CM</div>
              <div>
                <div className="user-name">Carlos Mendez</div>
                <div className="user-id">ID: #USR002</div>
              </div>
            </div>
          </td>
          <td>carlos.mendez@email.com</td>
          <td><span className="role-badge role-student">Estudiante</span></td>
          <td><span className="status-badge status-active">Activo</span></td>
          <td>Hace 1 día</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-purple">AR</div>
              <div>
                <div className="user-name">Ana Ruiz</div>
                <div className="user-id">ID: #USR003</div>
              </div>
            </div>
          </td>
          <td>ana.ruiz@email.com</td>
          <td><span className="role-badge role-admin">Administrador</span></td>
          <td><span className="status-badge status-active">Activo</span></td>
          <td>En línea</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Desactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="user-info">
              <div className="user-avatar user-avatar-orange">LS</div>
              <div>
                <div className="user-name">Luis Silva</div>
                <div className="user-id">ID: #USR004</div>
              </div>
            </div>
          </td>
          <td>luis.silva@email.com</td>
          <td><span className="role-badge role-student">Estudiante</span></td>
          <td><span className="status-badge status-inactive">Inactivo</span></td>
          <td>Hace 2 semanas</td>
          <td>
            <div className="action-buttons">
              <button className="btn-action btn-view" title="Ver Perfil">
                <FaEye />
              </button>
              <button className="btn-action btn-edit" title="Editar">
                <FaEdit />
              </button>
              <button className="btn-action btn-delete" title="Reactivar">
                <FaTrash />
              </button>
            </div>
          </td>
        </tr>
      </>
    );
  };

  return (
    <>
      <h1 className="admin-page-title admin-usuarios-title">👥 Gestión de Usuarios</h1>
      
      
          <AdminActionsBar btnTitle={"Nuevo Usuario"} placeholderTitle={"Buscar Usuarios..."} btnClassName="btnAdd" btnStyle={gradients.greenGradient}/>


      <div className="admin-page-container admin-usuarios-container">
        {/* Estadísticas de usuarios */}
        <div className="stats-grid">
          <CardStats icon={<FaUserGraduate/>} number={"2,847"}label={"Estudiantes"}/>
          <CardStats icon={<FaChalkboardTeacher/>} number={"156"}label={"Docentes"}/>
          <CardStats icon={<FaUserShield/>} number={"8"}label={"Administradores"}/>
          <CardStats icon={<MdLibraryAddCheck/>} number={"89"}label={"Usuarios Activos"}/>


        </div>

        {/* Filtros rápidos */}
        <div className="quick-filters">
          <button 
            className={`filter-chip ${filtroActivo === "Estudiantes" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Estudiantes")}
          >
            Estudiantes
          </button>
          <button 
            className={`filter-chip ${filtroActivo === "Docentes" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Docentes")}
          >
            Docentes
          </button>
          <button 
            className={`filter-chip ${filtroActivo === "Administradores" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Administradores")}
          >
            Administradores
          </button>
          <button 
            className={`filter-chip ${filtroActivo === "Activos" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Activos")}
          >
            Activos
          </button>
          <button 
            className={`filter-chip ${filtroActivo === "Inactivos" ? "active" : ""}`}
            onClick={() => setFiltroActivo("Inactivos")}
          >
            Inactivos
          </button>
        </div>

        {/* Tabla de usuarios */}
        <div className="table-container">
          <table className="admin-table usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>
                  {filtroActivo === "Docentes" ? "Institución" : 
                   filtroActivo === "Estudiantes" ? "Aula" : 
                   filtroActivo === "Administradores" ? "DNI" :
                   "Última Actividad"}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {renderizarFilasTabla()}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando 1-10 de 3,011 usuarios
          </div>
          <div className="pagination-buttons">
            <button className="btn-pagination" disabled>Anterior</button>
            <button className="btn-pagination active">1</button>
            <button className="btn-pagination">2</button>
            <button className="btn-pagination">3</button>
            <button className="btn-pagination">...</button>
            <button className="btn-pagination">302</button>
            <button className="btn-pagination">Siguiente</button>
          </div>
        </div>
      </div>
    </>
  );
}


