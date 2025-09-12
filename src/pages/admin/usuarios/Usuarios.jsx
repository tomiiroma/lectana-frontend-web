import "../AdminPages.css";
import "./Usuarios.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload, FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";

export default function Usuarios() {
  return (
    <>
      <h1 className="admin-page-title admin-usuarios-title">👥 Gestión de Usuarios</h1>
      
      {/* Barra de acciones */}
      <div className="admin-actions-bar usuarios-actions">
        <button className="btn-primary usuarios-btn">
          <FaPlus /> Nuevo Usuario
        </button>
        <div className="search-filter-group">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar usuarios..." />
          </div>
          <button className="btn-secondary usuarios-btn-secondary">
            <FaFilter /> Filtrar por Rol
          </button>
          <button className="btn-secondary usuarios-btn-secondary">
            <FaDownload /> Exportar Lista
          </button>
        </div>
      </div>

      <div className="admin-page-container admin-usuarios-container">
        {/* Estadísticas de usuarios */}
        <div className="stats-grid">
          <div className="stat-card stat-card-usuarios-green">
            <div className="stat-icon">
              <FaUserGraduate />
            </div>
            <div className="stat-number">2,847</div>
            <div className="stat-label">Estudiantes</div>
          </div>
          <div className="stat-card stat-card-usuarios-blue">
            <div className="stat-icon">
              <FaChalkboardTeacher />
            </div>
            <div className="stat-number">156</div>
            <div className="stat-label">Docentes</div>
          </div>
          <div className="stat-card stat-card-usuarios-purple">
            <div className="stat-icon">
              <FaUserShield />
            </div>
            <div className="stat-number">8</div>
            <div className="stat-label">Administradores</div>
          </div>
          <div className="stat-card stat-card-usuarios-orange">
            <div className="stat-number">89%</div>
            <div className="stat-label">Usuarios Activos</div>
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="quick-filters">
          <button className="filter-chip active">Todos</button>
          <button className="filter-chip">Estudiantes</button>
          <button className="filter-chip">Docentes</button>
          <button className="filter-chip">Administradores</button>
          <button className="filter-chip">Activos</button>
          <button className="filter-chip">Inactivos</button>
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
                <th>Última Actividad</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
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
                <td>15/03/2024</td>
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
                <td>22/03/2024</td>
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
                <td>01/01/2024</td>
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
                <td>10/04/2024</td>
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


