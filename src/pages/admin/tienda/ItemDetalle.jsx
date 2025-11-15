import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { obtenerItemPorId, obtenerAlumnosItem } from '../../../api/items';
import '../AdminPages.css';
import './ItemDetalle.css';

export default function ItemDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatosItem();
  }, [id]);

  useEffect(() => {
    filtrarAlumnos();
  }, [busqueda, alumnos]);

  const cargarDatosItem = async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerItemPorId(id);

      if (!resultado.ok) {
        throw new Error(resultado.error || 'Error al cargar datos');
      }

      setItem(resultado.item);
      
      const alumnosResult = await obtenerAlumnosItem(id);
      console.log('📦 Resultado completo:', alumnosResult);
      
      if (alumnosResult.ok) {
        setAlumnos(alumnosResult.alumnos || []);
      }
      
      setCargando(false);

    } catch (error) {
      console.error("Error cargando datos del item:", error);
      setError(error.message || 'Error de conexión');
      setCargando(false);
    }
  };

  const filtrarAlumnos = () => {
    if (!busqueda.trim()) {
      setAlumnosFiltrados(alumnos);
      return;
    }

    const busquedaMinuscula = busqueda.toLowerCase();
    const filtrados = alumnos.filter(alumno => {
      const email = alumno.alumno?.usuario?.email || '';
      return email.toLowerCase().includes(busquedaMinuscula);
    });

    setAlumnosFiltrados(filtrados);
  };

  const handleVolver = () => {
    navigate('/admin/tienda');
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="page-header">
        <button className="btn-back" onClick={handleVolver}>
          <FaArrowLeft />
          Volver a Tienda
        </button>
      </div>

      <div className="admin-page-container item-detalle-container">
        {cargando ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando información...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={cargarDatosItem}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
            {/* Información del Avatar */}
            <div className="item-info-card">
              <img 
                src={item?.url_imagen || 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=🛍️'} 
                alt={item?.nombre}
                className="item-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/9C27B0/FFFFFF?text=🛍️';
                }}
              />
              <div className="item-info">
                <h1 className="item-titulo">{item?.nombre}</h1>
                <p className="item-descripcion">{item?.descripcion || 'Sin descripción'}</p>
                <div className="item-details">
                  <div className="detail-badge precio-badge">
                    <span className="detail-label">Precio:</span>
                    <span className="detail-value">{item?.precio} pts</span>
                  </div>
                  <div className="detail-badge estado-badge">
                    <span className="detail-label">Estado:</span>
                    <span className={`detail-value ${item?.disponible ? 'disponible' : 'no-disponible'}`}>
                      {item?.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>
                </div>
                <div className="item-stats-badge">
                  <FaShoppingCart className="cart-icon" />
                  <span>
                    {alumnos.length} {alumnos.length === 1 ? 'estudiante lo ha' : 'estudiantes lo han'} comprado
                  </span>
                </div>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="search-section">
              <h2 className="section-title">
                Estudiantes que compraron este avatar
              </h2>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Tabla de Alumnos */}
            <div className="table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha de Compra</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosFiltrados.length > 0 ? (
                    alumnosFiltrados.map((compra, index) => (
                      <tr key={`${compra.alumno_id_alumno}-${index}`}>
                        <td>{index + 1}</td>
                        <td className="email-cell">
                          {compra.alumno?.usuario?.nombre} {compra.alumno?.usuario?.apellido}
                        </td>
                        <td className="email-cell">
                          {compra.alumno?.usuario?.email || 'Sin email'}
                        </td>
                        <td className="fecha-cell">
                          {formatearFecha(compra.fecha_canje)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-results-cell">
                        <FaSearch className="no-results-icon" />
                        <p>
                          {busqueda.trim() 
                            ? 'No se encontraron estudiantes con ese criterio' 
                            : 'Ningún estudiante ha comprado este avatar aún'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {alumnosFiltrados.length > 0 && (
              <div className="table-footer">
                <p>
                  Mostrando {alumnosFiltrados.length} de {alumnos.length} estudiantes
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}