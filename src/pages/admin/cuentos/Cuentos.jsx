import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import "../AdminPages.css";
import { gradients } from "../../../styles/Gradients";
import "./Cuentos.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload, FaUser, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardStats from "../../../components/Cards/CardData/CardStats";
import React, { useEffect, useMemo, useState } from "react";
import CreateStoryWizard from "../../../components/Modals/CreateStoryWizard/CreateStoryWizard";
import EditStoryModal from "../../../components/Modals/EditStoryModal/EditStoryModal";
import CreateAuthorModal from "../../../components/Modals/CreateAuthorModal/CreateAuthorModal";
import CreateGenreModal from "../../../components/Modals/CreateGenreModal/CreateGenreModal";
import { listarCuentos, obtenerTotalCuentos } from "../../../api/cuentos";
import { listarAutores } from "../../../api/autores";
import { listarGeneros } from "../../../api/generos";

export default function Cuentos() {
  const [openWizard, setOpenWizard] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCuentoId, setEditingCuentoId] = useState(null);
  const [openAuthorModal, setOpenAuthorModal] = useState(false);
  const [openGenreModal, setOpenGenreModal] = useState(false);
  const [cuentos, setCuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ edad_publico: "", genero_id: "", autor_id: "" });
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [totalCuentos, setTotalCuentos] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const navigate = useNavigate();

  const fetchCuentos = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await listarCuentos(params);
      
      if (data && typeof data === 'object' && 'items' in data) {
        // Respuesta con paginación
        setCuentos(Array.isArray(data.items) ? data.items : []);
        setPagination({
          page: data.page || 1,
          total: data.total || 0,
          totalPages: data.totalPages || 0
        });
      } else {
        // Respuesta simple (sin paginación)
        setCuentos(Array.isArray(data) ? data : []);
        const total = Array.isArray(data) ? data.length : 0;
        setPagination({
          page: 1,
          total: total,
          totalPages: total > 10 ? Math.ceil(total / 10) : 1
        });
      }
    } catch (e) {
      setError(e.message || "Error cargando cuentos");
      setCuentos([]);
      setPagination({ page: 1, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuentos();
    // cargar combos
    (async () => {
      try {
        const [a, g] = await Promise.all([listarAutores(), listarGeneros()]);
        setAutores(Array.isArray(a) ? a : []);
        setGeneros(Array.isArray(g) ? g : []);
        // total cuentos
        const total = await obtenerTotalCuentos();
        setTotalCuentos(Number(total) || 0);
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = {};
      
      // Búsqueda por título (solo si hay texto)
      if (search && search.trim()) {
        params.titulo = search.trim();
      }
      
      // Filtros adicionales (solo si tienen valor)
      if (filters.edad_publico) params.edad_publico = Number(filters.edad_publico);
      if (filters.genero_id) params.genero_id = Number(filters.genero_id);
      if (filters.autor_id) params.autor_id = Number(filters.autor_id);
      
      // Agregar paginación
      params.page = pagination.page;
      params.limit = 10;
      
      console.log("Buscando cuentos con params:", params);
      fetchCuentos(params);
    }, 300);
    return () => clearTimeout(t);
  }, [search, filters, pagination.page]);

  // Resetear página cuando cambien filtros o búsqueda
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [search, filters]);

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Función para verificar si debe mostrar paginación
  const shouldShowPagination = () => {
    return pagination.totalPages > 1;
  };

  return (
    <>
      <h1 className="admin-page-title admin-cuentos-title">📚 Gestión de Cuentos</h1>
      

      <AdminActionsBar 
        btnTitle={"Nuevo Cuento"} 
        placeholderTitle={"Buscar cuentos..."} 
        btnClassName="btnAdd" 
        btnStyle={gradients.orangeGradient} 
        onBtnClick={() => setOpenWizard(true)} 
        onSearch={setSearch} 
        onFilter={() => setShowFilters((s) => !s)}
        additionalButtons={[
          {
            title: "Crear Autor",
            icon: <FaUser />,
            className: "btnAuthor",
            onClick: () => setOpenAuthorModal(true)
          },
          {
            title: "Crear Género", 
            icon: <FaTag />,
            className: "btnGenre",
            onClick: () => setOpenGenreModal(true)
          }
        ]}
      />

      {showFilters && (
        <div className="admin-filters" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          background: "#0f172a",
          padding: "12px 16px",
          borderRadius: "12px",
          margin: "12px 0"
        }}>
          <div>
            <label className="filter-label">Edad público</label>
            <input type="number" min="4" max="18" value={filters.edad_publico} onChange={(e)=> setFilters({ ...filters, edad_publico: e.target.value })} className="form-input" placeholder="4-18" />
          </div>
          <div>
            <label className="filter-label">Género</label>
            <select className="form-input" value={filters.genero_id} onChange={(e)=> setFilters({ ...filters, genero_id: e.target.value })}>
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g.id_genero} value={g.id_genero}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="filter-label">Autor</label>
            <select className="form-input" value={filters.autor_id} onChange={(e)=> setFilters({ ...filters, autor_id: e.target.value })}>
              <option value="">Todos</option>
              {autores.map((a) => (
                <option key={a.id_autor} value={a.id_autor}>{a.nombre} {a.apellido}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
            <button className="btn-secondary" onClick={()=> setFilters({ edad_publico: "", genero_id: "", autor_id: "" })}>Limpiar</button>
          </div>
        </div>
      )}
    
      <div className="admin-page-container admin-cuentos-container">
        {/* Estadística: total de cuentos */}
        <div className="stats-grid">
          <CardStats number={`${totalCuentos}`} label={"Total Cuentos"}/>
        </div>

        {/* Tabla de cuentos desde API */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Género</th>
                <th>Edad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5}>Cargando cuentos...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={5}>Error: {error}</td>
                </tr>
              )}
              {!loading && !error && cuentos.length === 0 && (
                <tr>
                  <td colSpan={5}>No hay cuentos para mostrar</td>
                </tr>
              )}
              {!loading && !error && cuentos.map((c, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="story-info">
                      <div className="story-cover"></div>
                      <div>
                        <div className="story-title">{c.titulo}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.autor ? `${c.autor.nombre} ${c.autor.apellido}` : "-"}</td>
                  <td><span className="category-tag">{c.genero?.nombre || "-"}</span></td>
                  <td>{c.edad_publico ?? "-"}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action btn-view" title="Ver" onClick={() => navigate(`/admin/cuentos/${c.id_cuento ?? c.id ?? ""}`)} disabled={!c.id_cuento && !c.id}>
                        <FaEye />
                      </button>
                      <button className="btn-action btn-edit" title="Editar" onClick={() => {
                        setEditingCuentoId(c.id_cuento ?? c.id ?? "");
                        setOpenEditModal(true);
                      }} disabled={!c.id_cuento && !c.id}>
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" title="Eliminar">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación Condicional */}
        {shouldShowPagination() && (
          <div className="pagination-container">
            <div className="pagination-info">
              {(() => {
                const startItem = ((pagination.page - 1) * 10) + 1;
                const endItem = Math.min(pagination.page * 10, pagination.total);
                return `Mostrando ${startItem}-${endItem} de ${pagination.total} cuentos`;
              })()}
            </div>
            <div className="pagination-buttons">
              {(() => {
                const buttons = [];
                
                // Botón Anterior
                buttons.push(
                  <button 
                    key="prev"
                    className="btn-pagination" 
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Anterior
                  </button>
                );
                
                // Números de página
                const startPage = Math.max(1, pagination.page - 2);
                const endPage = Math.min(pagination.totalPages, pagination.page + 2);
                
                for (let i = startPage; i <= endPage; i++) {
                  buttons.push(
                    <button 
                      key={i}
                      className={`btn-pagination ${i === pagination.page ? 'active' : ''}`}
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
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
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

      <CreateStoryWizard isOpen={openWizard} onClose={() => setOpenWizard(false)} onCreated={() => { fetchCuentos(search ? { titulo: search } : {}); }}/>
      
      <EditStoryModal 
        isOpen={openEditModal} 
        onClose={() => {
          setOpenEditModal(false);
          setEditingCuentoId(null);
        }} 
        cuentoId={editingCuentoId}
        onUpdated={() => { 
          fetchCuentos(search ? { titulo: search } : {}); 
          // Refrescar total también
          obtenerTotalCuentos().then(total => setTotalCuentos(Number(total) || 0));
        }}
      />
      
      <CreateAuthorModal 
        isOpen={openAuthorModal} 
        onClose={() => setOpenAuthorModal(false)}
        onCreated={() => {
          // Refrescar lista de autores para los filtros
          listarAutores().then(a => setAutores(Array.isArray(a) ? a : []));
        }}
      />
      
      <CreateGenreModal 
        isOpen={openGenreModal} 
        onClose={() => setOpenGenreModal(false)}
        onCreated={() => {
          // Refrescar lista de géneros para los filtros
          listarGeneros().then(g => setGeneros(Array.isArray(g) ? g : []));
        }}
      />
    </>
  );
}


