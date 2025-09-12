import "../AdminPages.css";
import "./Cuentos.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload } from "react-icons/fa";

export default function Cuentos() {
  return (
    <>
      <h1 className="admin-page-title admin-cuentos-title">📚 Gestión de Cuentos</h1>
      
      {/* Barra de acciones */}
      <div className="admin-actions-bar">
        <button className="btn-primary">
          <FaPlus /> Nuevo Cuento
        </button>
        <div className="search-filter-group">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Buscar cuentos..." />
          </div>
          <button className="btn-secondary">
            <FaFilter /> Filtros
          </button>
          <button className="btn-secondary">
            <FaDownload /> Exportar
          </button>
        </div>
      </div>

      <div className="admin-page-container admin-cuentos-container">
        {/* Estadísticas rápidas */}
        <div className="stats-grid">
          <div className="stat-card stat-card-orange">
            <div className="stat-number">156</div>
            <div className="stat-label">Total Cuentos</div>
          </div>
          <div className="stat-card stat-card-green">
            <div className="stat-number">89</div>
            <div className="stat-label">Publicados</div>
          </div>
          <div className="stat-card stat-card-blue">
            <div className="stat-number">23</div>
            <div className="stat-label">Borradores</div>
          </div>
          <div className="stat-card stat-card-purple">
            <div className="stat-number">4.8</div>
            <div className="stat-label">Rating Promedio</div>
          </div>
        </div>

        {/* Tabla de cuentos */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th>Edad</th>
                <th>Estado</th>
                <th>Lecturas</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">El Dragón Valiente</div>
                      <div className="story-subtitle">Historia de aventuras</div>
                    </div>
                  </div>
                </td>
                <td>María González</td>
                <td><span className="category-tag cat-adventure">Aventura</span></td>
                <td>6-8 años</td>
                <td><span className="status-badge status-published">Publicado</span></td>
                <td>1,234</td>
                <td>15/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">La Princesa del Bosque</div>
                      <div className="story-subtitle">Cuento de fantasía</div>
                    </div>
                  </div>
                </td>
                <td>Carlos Mendez</td>
                <td><span className="category-tag cat-fantasy">Fantasía</span></td>
                <td>4-6 años</td>
                <td><span className="status-badge status-draft">Borrador</span></td>
                <td>0</td>
                <td>20/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">El Robot Amigable</div>
                      <div className="story-subtitle">Ciencia ficción para niños</div>
                    </div>
                  </div>
                </td>
                <td>Ana Ruiz</td>
                <td><span className="category-tag cat-scifi">Sci-Fi</span></td>
                <td>8-10 años</td>
                <td><span className="status-badge status-published">Publicado</span></td>
                <td>856</td>
                <td>10/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
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
            Mostrando 1-10 de 156 cuentos
          </div>
          <div className="pagination-buttons">
            <button className="btn-pagination" disabled>Anterior</button>
            <button className="btn-pagination active">1</button>
            <button className="btn-pagination">2</button>
            <button className="btn-pagination">3</button>
            <button className="btn-pagination">...</button>
            <button className="btn-pagination">16</button>
            <button className="btn-pagination">Siguiente</button>
          </div>
        </div>
      </div>
    </>
  );
}


