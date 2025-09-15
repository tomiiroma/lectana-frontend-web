import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import "../AdminPages.css";
import { gradients } from "../../../styles/Gradients";
import "./Cuentos.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardStats from "../../../components/Cards/CardData/CardStats";
import React, { useEffect, useMemo, useState } from "react";
import CreateStoryWizard from "../../../components/Modals/CreateStoryWizard/CreateStoryWizard";
import EditStoryModal from "../../../components/Modals/EditStoryModal/EditStoryModal";
import { listarCuentos, obtenerTotalCuentos } from "../../../api/cuentos";
import { listarAutores } from "../../../api/autores";
import { listarGeneros } from "../../../api/generos";

export default function Cuentos() {
  const [openWizard, setOpenWizard] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCuentoId, setEditingCuentoId] = useState(null);
  const [cuentos, setCuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ edad_publico: "", genero_id: "", autor_id: "" });
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [totalCuentos, setTotalCuentos] = useState(0);
  const navigate = useNavigate();

  const fetchCuentos = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await listarCuentos(params);
      setCuentos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error cargando cuentos");
      setCuentos([]);
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
      const params = { ...(
        search ? { titulo: search } : {}
      ) };
      // No enviamos filtros vacíos
      if (filters.edad_publico) params.edad_publico = Number(filters.edad_publico);
      if (filters.genero_id) params.genero_id = Number(filters.genero_id);
      if (filters.autor_id) params.autor_id = Number(filters.autor_id);
      fetchCuentos(params);
    }, 300);
    return () => clearTimeout(t);
  }, [search, filters]);

  return (
    <>
      <h1 className="admin-page-title admin-cuentos-title">📚 Gestión de Cuentos</h1>
      

      <AdminActionsBar btnTitle={"Nuevo Cuento"} placeholderTitle={"Buscar cuentos..."} btnClassName="btnAdd" btnStyle={gradients.orangeGradient} onBtnClick={() => setOpenWizard(true)} onSearch={setSearch} onFilter={() => setShowFilters((s) => !s)}/>

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
            <label style={{ display: "block", color: "#cbd5e1", fontSize: 12, marginBottom: 6 }}>Edad público</label>
            <input type="number" min="4" max="18" value={filters.edad_publico} onChange={(e)=> setFilters({ ...filters, edad_publico: e.target.value })} className="form-input" placeholder="4-18" />
          </div>
          <div>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: 12, marginBottom: 6 }}>Género</label>
            <select className="form-input" value={filters.genero_id} onChange={(e)=> setFilters({ ...filters, genero_id: e.target.value })}>
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g.id_genero} value={g.id_genero}>{g.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", color: "#cbd5e1", fontSize: 12, marginBottom: 6 }}>Autor</label>
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
    </>
  );
}


