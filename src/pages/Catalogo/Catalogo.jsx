import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaSearch, FaFilter, FaBook, FaStar, FaClock, FaArrowLeft } from "react-icons/fa";
import CardLibro from "../../components/Cards/CardLibro";
import { obtenerCuentosPublicos } from "../../api/cuentos";
import { obtenerGenerosPublicos } from "../../api/generos";
import "./Catalogo.css";

// Categorías por defecto (fallback si el backend no responde)
const iconosPorGenero = {
  "fantasia": "📚",
  "aventura": "🗺️",
  "misterio": "🔍",
  "ciencia": "🔬",
  "historia": "🏛️",
  "valores": "❤️",
  "realista": "📖",
  "default": "📚"
};

function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaInicial = searchParams.get("categoria") || "";
  
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(categoriaInicial);
  const [edadSeleccionada, setEdadSeleccionada] = useState("");
  const [cuentos, setCuentos] = useState([]);
  const [cuentosFiltrados, setCuentosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const cuentosPorPagina = 12;



  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar cuentos cuando cambien los filtros
  useEffect(() => {
    filtrarCuentos();
  }, [busqueda, categoriaSeleccionada, edadSeleccionada, cuentos]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, categoriaSeleccionada, edadSeleccionada]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      
      const generosData = await obtenerGenerosPublicos();
      const categoriasConIconos = generosData.map(genero => ({
        ...genero,
        icono: iconosPorGenero[genero.nombre.toLowerCase()] || iconosPorGenero.default
      }));
      setCategorias(categoriasConIconos);

      
      const cuentosData = await obtenerCuentosPublicos({ limite: 100 });
      setCuentos(cuentosData.cuentos || []);
      
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setCuentos([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCuentos = () => {
    let resultado = [...cuentos];

  
    if (busqueda.trim()) {
      resultado = resultado.filter(cuento =>
        cuento.titulo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

   
    if (categoriaSeleccionada) {
      resultado = resultado.filter(cuento =>
        cuento.genero?.nombre?.toLowerCase() === categoriaSeleccionada.toLowerCase()
      );
    }

    if (edadSeleccionada) {
      const [edadMin, edadMax] = edadSeleccionada.split('-').map(Number);
      resultado = resultado.filter(cuento => {
        const edad = cuento.edad_publico;
        return edad >= edadMin && edad <= edadMax;
      });
    }

    setCuentosFiltrados(resultado);
  };

  const seleccionarCategoria = (categoria) => {
    const nuevaCategoria = categoria === categoriaSeleccionada ? "" : categoria;
    setCategoriaSeleccionada(nuevaCategoria);
    setSearchParams(nuevaCategoria ? { categoria: nuevaCategoria } : {});
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaSeleccionada("");
    setEdadSeleccionada("");
    setSearchParams({});
  };

  
  const edadesDisponibles = ["3-5", "5-7", "6-8", "7-9", "8-10", "9-11", "10-12", "12-15", "15+"];

  
  const indexUltimoCuento = paginaActual * cuentosPorPagina;
  const indexPrimerCuento = indexUltimoCuento - cuentosPorPagina;
  const cuentosActuales = cuentosFiltrados.slice(indexPrimerCuento, indexUltimoCuento);
  const totalPaginas = Math.ceil(cuentosFiltrados.length / cuentosPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            Explora nuestra colección de {loading ? '...' : cuentosFiltrados.length} cuentos educativos
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
              {categorias.map((cat) => {
                // Contar cuentos de esta categoría
                const cantidadCuentos = cuentos.filter(
                  c => c.genero?.nombre?.toLowerCase() === cat.nombre.toLowerCase()
                ).length;

                return (
                  <button
                    key={cat.id_genero}
                    className={`categoria-item ${
                      categoriaSeleccionada.toLowerCase() === cat.nombre.toLowerCase() ? "active" : ""
                    }`}
                    onClick={() => seleccionarCategoria(cat.nombre)}
                  >
                    <span className="categoria-icono">{cat.icono}</span>
                    <span className="categoria-nombre">
                      {cat.nombre} ({cantidadCuentos})
                    </span>
                    {categoriaSeleccionada.toLowerCase() === cat.nombre.toLowerCase() && (
                      <span className="check-icon">✓</span>
                    )}
                  </button>
                );
              })}
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
              {loading ? "Cargando..." : `${cuentosFiltrados.length} ${cuentosFiltrados.length === 1 ? "cuento encontrado" : "cuentos encontrados"}`}
            </h2>
            {totalPaginas > 1 && (
              <span className="pagina-info">
                Página {paginaActual} de {totalPaginas}
              </span>
            )}
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Cargando cuentos...</p>
            </div>
          ) : cuentosActuales.length > 0 ? (
            <>
              <div className="libros-grid">
                {cuentosActuales.map((cuento) => (
                  <CardLibro 
                    key={cuento.id_cuento} 
                    cuento={cuento}
                  />
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="paginacion">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="paginacion-btn"
                  >
                    ← Anterior
                  </button>

                  <div className="paginacion-numeros">
                    {[...Array(totalPaginas)].map((_, index) => {
                      const numeroPagina = index + 1;
                      
                      if (
                        numeroPagina === 1 ||
                        numeroPagina === totalPaginas ||
                        (numeroPagina >= paginaActual - 1 && numeroPagina <= paginaActual + 1)
                      ) {
                        return (
                          <button
                            key={numeroPagina}
                            onClick={() => cambiarPagina(numeroPagina)}
                            className={`paginacion-numero ${
                              paginaActual === numeroPagina ? "active" : ""
                            }`}
                          >
                            {numeroPagina}
                          </button>
                        );
                      } else if (
                        numeroPagina === paginaActual - 2 ||
                        numeroPagina === paginaActual + 2
                      ) {
                        return <span key={numeroPagina}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="paginacion-btn"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
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
