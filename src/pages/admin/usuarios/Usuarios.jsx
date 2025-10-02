import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import CardStats from "../../../components/Cards/CardData/CardStats";
import CreateUser from "../../../components/CreateUser/CreateUser";
import ModalPerfil from "../../../components/Modales/ModalPerfil/ModalPerfil";
import ModalEditarUsuario from "../../../components/Modales/ModalEditarUsuario/ModalEditarUsuario";
import { gradients } from "../../../styles/Gradients";
import "../AdminPages.css";
import "./Usuarios.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload, FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";
import { MdLibraryAddCheck } from "react-icons/md";
import { obtenerDocentesConFiltros, obtenerDocentePorId } from "../../../api/docentes";
import { obtenerAlumnos, obtenerAlumnoPorId } from "../../../api/alumnos";
import { obtenerAdministradores, obtenerEstadisticasUsuarios, obtenerUsuariosActivos, obtenerUsuariosInactivos, obtenerAdministradorPorId } from "../../../api/administradores";
import { obtenerPerfilPorIdUsuario } from "../../../api/usuarios";
import { useEffect, useState } from "react";

export default function Usuarios() {
  const [docentesData, setDocentesData] = useState(null);
  const [alumnosData, setAlumnosData] = useState(null);
  const [administradoresData, setAdministradoresData] = useState(null);
  const [usuariosActivosData, setUsuariosActivosData] = useState(null);
  const [usuariosInactivosData, setUsuariosInactivosData] = useState(null);
  const [estadisticasData, setEstadisticasData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState("Estudiantes");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null);
  
  // Estado de paginación para cada tipo de usuario
  const [pagination, setPagination] = useState({
    docentes: { page: 1, total: 0, totalPages: 0 },
    estudiantes: { page: 1, total: 0, totalPages: 0 },
    administradores: { page: 1, total: 0, totalPages: 0 },
    activos: { page: 1, total: 0, totalPages: 0 },
    inactivos: { page: 1, total: 0, totalPages: 0 }
  });

  // Función para obtener docentes con paginación
  const obtenerDocentesData = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo docentes página", page, "búsqueda:", search);
      
      const params = { page, limit: 10 };
      if (search && search.trim()) params.q = search.trim();
      
      const data = await obtenerDocentesConFiltros(params);
      
      console.log("✅ Datos de docentes recibidos:", data);
      setDocentesData(data);
      
      // Actualizar estado de paginación
      setPagination(prev => ({
        ...prev,
        docentes: {
          page: data.page,
          total: data.total,
          totalPages: data.total_pages
        }
      }));
      
    } catch (err) {
      console.error("❌ Error obteniendo docentes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener alumnos con paginación
  const obtenerAlumnosData = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo alumnos página", page, "búsqueda:", search);
      
      const params = { page, limit: 10 };
      if (search && search.trim()) params.q = search.trim();
      
      const data = await obtenerAlumnos(params);
      
      console.log("✅ Datos de alumnos recibidos:", data);
      setAlumnosData(data);
      
      // Actualizar estado de paginación
      setPagination(prev => ({
        ...prev,
        estudiantes: {
          page: data.page,
          total: data.total,
          totalPages: data.total_pages
        }
      }));
      
    } catch (err) {
      console.error("❌ Error obteniendo alumnos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener administradores con paginación
  const obtenerAdministradoresData = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo administradores página", page, "búsqueda:", search);
      
      const params = { page, limit: 10 };
      if (search && search.trim()) params.q = search.trim();
      
      const data = await obtenerAdministradores(params);
      
      console.log("✅ Datos de administradores recibidos:", data);
      setAdministradoresData(data);
      
      // Actualizar estado de paginación
      setPagination(prev => ({
        ...prev,
        administradores: {
          page: data.page,
          total: data.total,
          totalPages: data.total_pages
        }
      }));
      
    } catch (err) {
      console.error("❌ Error obteniendo administradores:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener estadísticas
  const obtenerEstadisticasData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo estadísticas...");
      
      const data = await obtenerEstadisticasUsuarios();
      
      console.log("✅ Estadísticas recibidas:", data);
      setEstadisticasData(data);
      
    } catch (err) {
      console.error("❌ Error obteniendo estadísticas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios activos con paginación
  const obtenerUsuariosActivosData = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo usuarios activos página", page, "búsqueda:", search);
      
      const params = { page, limit: 20 };
      if (search && search.trim()) params.q = search.trim();
      
      const data = await obtenerUsuariosActivos(params);
      
      console.log("✅ Usuarios activos recibidos:", data);
      setUsuariosActivosData(data);
      
      // Actualizar estado de paginación
      setPagination(prev => ({
        ...prev,
        activos: {
          page: data.page,
          total: data.total,
          totalPages: data.total_pages
        }
      }));
      
    } catch (err) {
      console.error("❌ Error obteniendo usuarios activos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener usuarios inactivos con paginación
  const obtenerUsuariosInactivosData = async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Obteniendo usuarios inactivos página", page, "búsqueda:", search);
      
      const params = { page, limit: 20 };
      if (search && search.trim()) params.q = search.trim();
      
      const data = await obtenerUsuariosInactivos(params);
      
      console.log("✅ Usuarios inactivos recibidos:", data);
      setUsuariosInactivosData(data);
      
      // Actualizar estado de paginación
      setPagination(prev => ({
        ...prev,
        inactivos: {
          page: data.page,
          total: data.total,
          totalPages: data.total_pages
        }
      }));
      
    } catch (err) {
      console.error("❌ Error obteniendo usuarios inactivos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar la carga inicial de datos
  useEffect(() => {
    obtenerDocentesData();
    obtenerAlumnosData();
    obtenerAdministradoresData();
    obtenerEstadisticasData();
    obtenerUsuariosActivosData();
    obtenerUsuariosInactivosData();
  }, []);


  // useEffect para manejar cambio de filtro activo
  useEffect(() => {
    console.log("🔄 Cambiando filtro activo a:", filtroActivo);
    
    // Cargar datos del nuevo filtro
    switch (filtroActivo) {
      case "Docentes":
        obtenerDocentesData(1, "");
        break;
      case "Estudiantes":
        obtenerAlumnosData(1, "");
        break;
      case "Administradores":
        obtenerAdministradoresData(1, "");
        break;
      case "Activos":
        obtenerUsuariosActivosData(1, "");
        break;
      case "Inactivos":
        obtenerUsuariosInactivosData(1, "");
        break;
      default:
        console.log("Filtro no reconocido:", filtroActivo);
    }
  }, [filtroActivo]);

  // Función para manejar cambio de página
  const handlePageChange = (newPage) => {
    console.log(`🔄 Cambiando a página ${newPage} para filtro: ${filtroActivo}`);
    
    switch (filtroActivo) {
      case "Docentes":
        obtenerDocentesData(newPage, "");
        break;
      case "Estudiantes":
        obtenerAlumnosData(newPage, "");
        break;
      case "Administradores":
        obtenerAdministradoresData(newPage, "");
        break;
      case "Activos":
        obtenerUsuariosActivosData(newPage, "");
        break;
      case "Inactivos":
        obtenerUsuariosInactivosData(newPage, "");
        break;
      default:
        console.log("Filtro no reconocido:", filtroActivo);
    }
  };

  // Función para manejar cuando se crea un usuario
  const handleUserCreated = (userType, userData) => {
    console.log(`✅ Usuario ${userType} creado exitosamente:`, userData);
    
    // Recargar los datos para mostrar el nuevo usuario
    obtenerEstadisticasData();
    obtenerUsuariosActivosData();
    
    // Mostrar mensaje de éxito (opcional)
    alert(`¡${userType.charAt(0).toUpperCase() + userType.slice(1)} creado exitosamente!`);
  };

  // Función para manejar clic en "Ver Perfil"
  const handleViewProfile = (userType, userId) => {
    console.log(`👁️ Abriendo perfil de ${userType} con ID: ${userId}`);
    console.log(`🔍 Tipo de usuario: "${userType}"`);
    console.log(`🔍 ID del usuario: ${userId}`);
    setSelectedUser({ type: userType, id: userId });
    setMostrarModalPerfil(true);
  };

  // Función para manejar clic en "Ver Perfil" desde tablas de activos/inactivos
  const handleViewProfileFromMixedTable = (usuario) => {
    console.log(`👁️ Abriendo perfil desde tabla mixta:`, usuario);
    console.log(`🔍 usuario.rol:`, usuario.rol);
    console.log(`🔍 usuario.datos_rol:`, usuario.datos_rol);
    console.log(`🔍 usuario.id_usuario:`, usuario.id_usuario);
    
    // En las tablas mixtas, solo tenemos el id_usuario (ID del usuario base)
    // Necesitamos usar una estrategia diferente para obtener los perfiles
    
    // Por ahora, vamos a usar el id_usuario y crear una función especial
    // que obtenga el perfil basado en el rol y el id_usuario
    const userId = usuario.id_usuario;
    const userRole = usuario.rol;
    
    console.log(`🔍 Usando id_usuario: ${userId} para rol: ${userRole}`);
    
    // Llamar a una función especial que maneje la obtención de perfiles desde tablas mixtas
    handleViewProfileFromUserId(userRole, userId);
  };

  // Nueva función para obtener perfiles usando el id_usuario
  const handleViewProfileFromUserId = (userRole, userId) => {
    console.log(`🔄 Obteniendo perfil de ${userRole} con id_usuario: ${userId}`);
    
    // Usar el modal con la nueva funcionalidad para tablas mixtas
    setSelectedUser({ type: userRole, id: userId, isMixedTable: true });
    setMostrarModalPerfil(true);
  };

  // Manejar editar usuario
  const handleEditUser = async (usuario) => {
    console.log('✏️ Abriendo edición de usuario:', usuario);
    
    try {
      // Obtener datos completos del usuario según el tipo
      let datosCompletos;
      const tipo = filtroActivo.toLowerCase();
      
      switch (tipo) {
        case 'estudiantes':
          console.log('🔍 IDs disponibles para estudiante:', { 
            id_alumno: usuario.id_alumno, 
            usuario_id_usuario: usuario.usuario_id_usuario,
            id_usuario: usuario.id_usuario 
          });
          datosCompletos = await obtenerAlumnoPorId(usuario.id_alumno || usuario.usuario_id_usuario);
          break;
        case 'docentes':
          console.log('🔍 IDs disponibles para docente:', { 
            id_docente: usuario.id_docente, 
            usuario_id_usuario: usuario.usuario_id_usuario,
            id_usuario: usuario.id_usuario 
          });
          datosCompletos = await obtenerDocentePorId(usuario.id_docente || usuario.usuario_id_usuario);
          break;
        case 'administradores':
          console.log('🔍 IDs disponibles para administrador:', { 
            id_administrador: usuario.id_administrador, 
            usuario_id_usuario: usuario.usuario_id_usuario,
            id_usuario: usuario.id_usuario 
          });
          datosCompletos = await obtenerAdministradorPorId(usuario.id_administrador || usuario.usuario_id_usuario);
          break;
        case 'activos':
        case 'inactivos':
          // Para tablas mixtas, usar el ID del usuario base
          console.log('🔍 IDs disponibles para tabla mixta:', { 
            id_usuario: usuario.id_usuario,
            usuario_id_usuario: usuario.usuario_id_usuario 
          });
          datosCompletos = await obtenerPerfilPorIdUsuario(usuario.id_usuario);
          break;
        default:
          throw new Error('Tipo de usuario no válido');
      }
      
      console.log('✅ Datos completos obtenidos:', datosCompletos);
      
      setUsuarioParaEditar({
        tipo: tipo,
        id: usuario.id_usuario || usuario.id_alumno || usuario.id_docente || usuario.id_administrador,
        datos: datosCompletos,
        esTablaMixta: tipo === 'activos' || tipo === 'inactivos'
      });
      
      setMostrarModalEditar(true);
    } catch (err) {
      console.error('❌ Error obteniendo datos para editar:', err);
      alert('Error al cargar los datos del usuario para editar');
    }
  };

  // Manejar usuario actualizado
  const handleUserUpdated = (usuarioActualizado) => {
    console.log('✅ Usuario actualizado:', usuarioActualizado);
    
    // Recargar datos según el filtro actual
    switch (filtroActivo) {
      case 'Estudiantes':
        obtenerAlumnosData(pagination.estudiantes.page);
        break;
      case 'Docentes':
        obtenerDocentesData(pagination.docentes.page);
        break;
      case 'Administradores':
        obtenerAdministradoresData(pagination.administradores.page);
        break;
      case 'Activos':
        obtenerUsuariosActivosData(pagination.activos.page);
        break;
      case 'Inactivos':
        obtenerUsuariosInactivosData(pagination.inactivos.page);
        break;
    }
    
    // También recargar estadísticas
    obtenerEstadisticasData();
  };

  // Función para obtener datos de paginación del filtro activo
  const getCurrentPagination = () => {
    switch (filtroActivo) {
      case "Docentes":
        return pagination.docentes;
      case "Estudiantes":
        return pagination.estudiantes;
      case "Administradores":
        return pagination.administradores;
      case "Activos":
        return pagination.activos;
      case "Inactivos":
        return pagination.inactivos;
      default:
        return { page: 1, total: 0, totalPages: 0 };
    }
  };

  // Función para verificar si debe mostrar paginación
  const shouldShowPagination = () => {
    const currentPagination = getCurrentPagination();
    return currentPagination.totalPages > 1;
  };

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
              <button 
                className="btn-action btn-view" 
                title="Ver Perfil"
                onClick={() => handleViewProfile('docente', docente.id_docente)}
              >
                <FaEye />
              </button>
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(docente)}
              >
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
              <button 
                className="btn-action btn-view" 
                title="Ver Perfil"
                onClick={() => handleViewProfile('estudiante', alumno.id_alumno)}
              >
                <FaEye />
              </button>
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(alumno)}
              >
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
              <button 
                className="btn-action btn-view" 
                title="Ver Perfil"
                onClick={() => handleViewProfile('administrador', administrador.id_administrador)}
              >
                <FaEye />
              </button>
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(administrador)}
              >
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

    if (filtroActivo === "Activos" && usuariosActivosData?.items) {
      if (usuariosActivosData.items.length === 0) {
        return (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>📭</div>
              <div>No hay usuarios activos por el momento</div>
            </td>
          </tr>
        );
      }

      return usuariosActivosData.items.map((usuario, index) => {
        
        const avatarColor = usuario.rol === 'docente' ? 'user-avatar-green' : 
                           usuario.rol === 'alumno' ? 'user-avatar-blue' : 'user-avatar-purple';
        
        const roleBadge = usuario.rol === 'docente' ? 'role-teacher' : 
                         usuario.rol === 'alumno' ? 'role-student' : 'role-admin';
        
        const roleText = usuario.rol === 'docente' ? 'Docente' : 
                        usuario.rol === 'alumno' ? 'Estudiante' : 'Administrador';
        
        const campoEspecifico = usuario.rol === 'docente' ? (usuario.datos_rol?.institucion_nombre || 'Sin institución') :
                               usuario.rol === 'alumno' ? `Aula #${usuario.datos_rol?.aula_id_aula || 'Sin aula'}` :
                               `DNI: ${usuario.datos_rol?.dni || 'Sin DNI'}`;

        return (
          <tr key={`activo-${index}`}>
            <td>
              <div className="user-info">
                <div className={`user-avatar ${avatarColor}`}>
                  {generarIniciales(usuario.nombre, usuario.apellido)}
                </div>
                <div>
                  <div className="user-name">
                    {usuario.nombre} {usuario.apellido}
                  </div>
                  <div className="user-id">ID: #{usuario.id_usuario}</div>
                </div>
              </div>
            </td>
            <td>{usuario.email}</td>
            <td><span className={`role-badge ${roleBadge}`}>{roleText}</span></td>
            <td>
              <span className="status-badge status-active">Activo</span>
            </td>
            <td>{campoEspecifico}</td>
            <td>
              <div className="action-buttons">
                <button 
                  className="btn-action btn-view" 
                  title="Ver Perfil"
                  onClick={() => handleViewProfileFromMixedTable(usuario)}
                >
                  <FaEye />
                </button>
                <button 
                  className="btn-action btn-edit" 
                  title="Editar"
                  onClick={() => handleEditUser(usuario)}
                >
                  <FaEdit />
                </button>
                <button className="btn-action btn-delete" title="Desactivar">
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        );
      });
    }

    if (filtroActivo === "Inactivos" && usuariosInactivosData?.items) {
      if (usuariosInactivosData.items.length === 0) {
        return (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>📭</div>
              <div>No hay usuarios inactivos por el momento</div>
            </td>
          </tr>
        );
      }

      return usuariosInactivosData.items.map((usuario, index) => {
        
        const avatarColor = usuario.rol === 'docente' ? 'user-avatar-green' : 
                           usuario.rol === 'alumno' ? 'user-avatar-blue' : 'user-avatar-purple';
        
        const roleBadge = usuario.rol === 'docente' ? 'role-teacher' : 
                         usuario.rol === 'alumno' ? 'role-student' : 'role-admin';
        
        const roleText = usuario.rol === 'docente' ? 'Docente' : 
                        usuario.rol === 'alumno' ? 'Estudiante' : 'Administrador';
        
        const campoEspecifico = usuario.rol === 'docente' ? (usuario.datos_rol?.institucion_nombre || 'Sin institución') :
                               usuario.rol === 'alumno' ? `Aula #${usuario.datos_rol?.aula_id_aula || 'Sin aula'}` :
                               `DNI: ${usuario.datos_rol?.dni || 'Sin DNI'}`;

        return (
          <tr key={`inactivo-${index}`}>
            <td>
              <div className="user-info">
                <div className={`user-avatar ${avatarColor}`}>
                  {generarIniciales(usuario.nombre, usuario.apellido)}
                </div>
                <div>
                  <div className="user-name">
                    {usuario.nombre} {usuario.apellido}
                  </div>
                  <div className="user-id">ID: #{usuario.id_usuario}</div>
                </div>
              </div>
            </td>
            <td>{usuario.email}</td>
            <td><span className={`role-badge ${roleBadge}`}>{roleText}</span></td>
            <td>
              <span className="status-badge status-inactive">Inactivo</span>
            </td>
            <td>{campoEspecifico}</td>
            <td>
              <div className="action-buttons">
                <button 
                  className="btn-action btn-view" 
                  title="Ver Perfil"
                  onClick={() => handleViewProfileFromMixedTable(usuario)}
                >
                  <FaEye />
                </button>
                <button 
                  className="btn-action btn-edit" 
                  title="Editar"
                  onClick={() => handleEditUser(usuario)}
                >
                  <FaEdit />
                </button>
                <button className="btn-action btn-delete" title="Reactivar">
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        );
      });
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
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(docente)}
              >
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
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(docente)}
              >
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
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(docente)}
              >
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
              <button 
                className="btn-action btn-edit" 
                title="Editar"
                onClick={() => handleEditUser(docente)}
              >
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
      
      
          <AdminActionsBar 
        btnTitle={"Nuevo Usuario"} 
        btnClassName="btnAdd" 
        btnStyle={gradients.greenGradient}
        onBtnClick={() => {
          console.log('🔄 Abriendo modal de crear usuario...');
          setShowCreateUser(true);
        }}
      />


      <div className="admin-page-container admin-usuarios-container">
        {/* Estadísticas de usuarios */}
        <div className="stats-grid">
          <CardStats 
            icon={<FaUserGraduate/>} 
            number={estadisticasData?.total_alumnos || "..."} 
            label={"Estudiantes"}
          />
          <CardStats 
            icon={<FaChalkboardTeacher/>} 
            number={estadisticasData?.total_docentes || "..."} 
            label={"Docentes"}
          />
          <CardStats 
            icon={<FaUserShield/>} 
            number={estadisticasData?.total_administradores || "..."} 
            label={"Administradores"}
          />
          <CardStats 
            icon={<MdLibraryAddCheck/>} 
            number={estadisticasData?.usuarios_activos || "..."} 
            label={"Usuarios Activos"}
          />
          <CardStats 
            icon={<FaUserGraduate/>} 
            number={estadisticasData?.usuarios_inactivos || "..."} 
            label={"Usuarios Inactivos"}
          />
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
                   filtroActivo === "Activos" ? "Información" :
                   filtroActivo === "Inactivos" ? "Información" :
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

        {/* Paginación Condicional */}
        {shouldShowPagination() && (
          <div className="pagination-container">
            <div className="pagination-info">
              {(() => {
                const currentPagination = getCurrentPagination();
                const startItem = ((currentPagination.page - 1) * 10) + 1;
                const endItem = Math.min(currentPagination.page * 10, currentPagination.total);
                return `Mostrando ${startItem}-${endItem} de ${currentPagination.total} usuarios`;
              })()}
            </div>
            <div className="pagination-buttons">
              {(() => {
                const currentPagination = getCurrentPagination();
                const buttons = [];
                
                // Botón Anterior
                buttons.push(
                  <button 
                    key="prev"
                    className="btn-pagination" 
                    disabled={currentPagination.page === 1}
                    onClick={() => handlePageChange(currentPagination.page - 1)}
                  >
                    Anterior
                  </button>
                );
                
                // Números de página
                const startPage = Math.max(1, currentPagination.page - 2);
                const endPage = Math.min(currentPagination.totalPages, currentPagination.page + 2);
                
                for (let i = startPage; i <= endPage; i++) {
                  buttons.push(
                    <button 
                      key={i}
                      className={`btn-pagination ${i === currentPagination.page ? 'active' : ''}`}
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Botón Siguiente
                buttons.push(
                  <button 
                    key="next"
                    className="btn-pagination" 
                    disabled={currentPagination.page === currentPagination.totalPages}
                    onClick={() => handlePageChange(currentPagination.page + 1)}
                  >
                    Siguiente
                  </button>
                );
                
                return buttons;
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Modal de creación de usuario */}
      <CreateUser
        isOpen={showCreateUser}
        onClose={() => {
          console.log('🔄 Cerrando modal desde Usuarios...');
          setShowCreateUser(false);
        }}
        onUserCreated={handleUserCreated}
      />

      {/* Modal de perfil de usuario */}
      <ModalPerfil
        estaAbierto={mostrarModalPerfil}
        alCerrar={() => {
          console.log('🔄 Cerrando modal de perfil...');
          setMostrarModalPerfil(false);
          setSelectedUser(null);
        }}
        tipoUsuario={selectedUser?.type}
        idUsuario={selectedUser?.id}
        esTablaMixta={selectedUser?.isMixedTable || false}
      />

      {/* Modal de edición de usuario */}
      <ModalEditarUsuario
        estaAbierto={mostrarModalEditar}
        alCerrar={() => {
          console.log('🔄 Cerrando modal de edición...');
          setMostrarModalEditar(false);
          setUsuarioParaEditar(null);
        }}
        usuarioSeleccionado={usuarioParaEditar?.datos}
        tipoUsuario={usuarioParaEditar?.tipo}
        alActualizarExitoso={handleUserUpdated}
      />
    </>
  );
}

