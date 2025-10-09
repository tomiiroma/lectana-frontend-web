import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaSearch, FaFilter, FaBook, FaStar, FaClock, FaArrowLeft } from "react-icons/fa";
import CardLibro from "../../components/Cards/CardLibro";
import { obtenerCuentos, obtenerCategorias } from "../../api/cuentos";
import "./Catalogo.css";

// Categorías por defecto (fallback si el backend no responde)
const categoriasDefault = [
  { id: 1, nombre: "Fantasía", icono: "📚", color: "#8b5cf6" },
  { id: 2, nombre: "Aventura", icono: "🗺️", color: "#10b981" },
  { id: 3, nombre: "Misterio", icono: "🔍", color: "#a78bfa" },
  { id: 4, nombre: "Ciencia", icono: "🔬", color: "#f59e0b" },
  { id: 5, nombre: "Historia", icono: "🏛️", color: "#ef4444" },
  { id: 6, nombre: "Valores", icono: "❤️", color: "#ec4899" }
];

function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") || "";
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaInicial);
  const [edadSeleccionada, setEdadSeleccionada] = useState("");
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState(categoriasDefault);
  const [loading, setLoading] = useState(true);
  const [totalLibros, setTotalLibros] = useState(0);

  // Cargar categorías del backend
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Cargar libros cuando cambien los filtros
  useEffect(() => {
    cargarLibros();
  }, [busqueda, categoriaSeleccionada, edadSeleccionada]);

  const cargarCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      if (response.data && response.data.length > 0) {
        // Mapear categorías del backend con iconos
        const categoriasConIconos = response.data.map((cat, index) => ({
          ...cat,
          icono: categoriasDefault[index]?.icono || "📚",
          color: categoriasDefault[index]?.color || "#8b5cf6"
        }));
        setCategorias(categoriasConIconos);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      // Mantener categorías por defecto si falla
    }
  };

  const cargarLibros = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100, // Cargar todos los libros disponibles
      };

      if (busqueda) params.busqueda = busqueda;
      if (categoriaSeleccionada) params.categoria = categoriaSeleccionada;
      if (edadSeleccionada) params.edad = edadSeleccionada;

      const response = await obtenerCuentos(params);
      setLibros(response.data || []);
      setTotalLibros(response.total || response.data?.length || 0);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      setLibros([]);
      setTotalLibros(0);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria === categoriaSeleccionada ? "" : categoria);
    setSearchParams(categoria ? { categoria } : {});
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("");
    setEdadSeleccionada("");
    setSearchParams({});
  };

  const edadesDisponibles = ["5-7", "6-8", "7-9", "8-10", "9-11", "10-12"];

  return (
    <div className="catalogo-container">
      {/* Header */}
      <div className="catalogo-header">
        <div className="catalogo-header-content">
          <Link to="/" className="back-to-home">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </Link>
          <h1 className="catalogo-title">Catálogo de Cuentos</h1>
          <p className="catalogo-subtitle">
            Explora nuestra colección de {librosEjemplo.length} cuentos educativos
          </p>
        </div>
      </div>

      {/* Layout principal con sidebar */}
      <div className="catalogo-layout">
        {/* Sidebar de filtros */}
        <aside className="filters-sidebar">
          <div className="filters-sidebar-header">
            <h3>
              <FaFilter /> Filtros
            </h3>
            {(categoriaSeleccionada || edadSeleccionada || busqueda) && (
              <button onClick={limpiarFiltros} className="clear-filters-btn">
                Limpiar
              </button>
            )}
          </div>

          {/* Barra de búsqueda en sidebar */}
          <div className="filter-group">
            <h4 className="filter-title">Buscar</h4>
            <div className="search-bar-sidebar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Título del cuento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="search-input-sidebar"
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} className="clear-search">
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="filter-group">
            <h4 className="filter-title">Categorías</h4>
            <div className="categorias-list">
              {categorias.map((cat) => (
                <button
                  key={cat.id || cat._id}
                  className={`categoria-item ${
                    categoriaSeleccionada === cat.nombre ? "active" : ""
                  }`}
                  onClick={() => seleccionarCategoria(cat.nombre)}
                >
                  <span className="categoria-icono">{cat.icono}</span>
                  <span className="categoria-nombre">{cat.nombre}</span>
                  {categoriaSeleccionada === cat.nombre && (
                    <span className="check-icon">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por edad */}
          <div className="filter-group">
            <h4 className="filter-title">Edad recomendada</h4>
            <div className="edad-list">
              {edadesDisponibles.map((edad) => (
                <button
                  key={edad}
                  className={`edad-item ${edadSeleccionada === edad ? "active" : ""}`}
                  onClick={() => setEdadSeleccionada(edad === edadSeleccionada ? "" : edad)}
                >
                  <span>👶 {edad} años</span>
                  {edadSeleccionada === edad && (
                    <span className="check-icon">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Contador de filtros activos */}
          {(categoriaSeleccionada || edadSeleccionada || busqueda) && (
            <div className="active-filters-count">
              {[categoriaSeleccionada, edadSeleccionada, busqueda].filter(Boolean).length} filtro(s) activo(s)
            </div>
          )}
        </aside>

        {/* Contenido principal */}
        <main className="catalogo-main">
          {/* Chips de filtros activos */}
          {(categoriaSeleccionada || edadSeleccionada || busqueda) && (
            <div className="active-filters-chips">
              {busqueda && (
                <span className="active-filter-chip">
                  🔍 "{busqueda}"
                  <button onClick={() => setBusqueda("")}>×</button>
                </span>
              )}
              {categoriaSeleccionada && (
                <span className="active-filter-chip">
                  📚 {categoriaSeleccionada}
                  <button onClick={() => seleccionarCategoria("")}>×</button>
                </span>
              )}
              {edadSeleccionada && (
                <span className="active-filter-chip">
                  👶 {edadSeleccionada} años
                  <button onClick={() => setEdadSeleccionada("")}>×</button>
                </span>
              )}
            </div>
          )}

          {/* Resultados */}
          <div className="resultados-header">
            <h2 className="resultados-count">
              {loading ? "Cargando..." : `${totalLibros} ${totalLibros === 1 ? "cuento encontrado" : "cuentos encontrados"}`}
            </h2>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Cargando libros...</p>
            </div>
          ) : libros.length > 0 ? (
            <div className="libros-grid">
              {libros.map((libro) => (
                <div key={libro.id || libro._id} className="libro-card-wrapper">
                  <CardLibro cuento={libro} />
                  <div className="libro-info">
                    <h3 className="libro-titulo">{libro.titulo}</h3>
                    <div className="libro-meta">
                      <span className="libro-categoria">
                        <FaBook /> {libro.categoria}
                      </span>
                      <span className="libro-duracion">
                        <FaClock /> {libro.duracion || "10 min"}
                      </span>
                      <span className="libro-edad">👶 {libro.edad || "6-8"} años</span>
                    </div>
                    <div className="libro-rating">
                      <FaStar className="star-icon" />
                      <span>{libro.rating || "4.5"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">📚</div>
              <h3>No se encontraron cuentos</h3>
              <p>Intenta con otros filtros o términos de búsqueda</p>
              <button onClick={limpiarFiltros} className="btn-primary">
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Catalogo;
