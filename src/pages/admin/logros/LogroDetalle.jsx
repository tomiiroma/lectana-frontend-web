import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaTrophy } from 'react-icons/fa';
import { obtenerAlumnosLogro } from '../../../api/logros';
import '../AdminPages.css';
import './LogroDetalle.css';

export default function LogroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [logro, setLogro] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatosLogro();
  }, [id]);

  useEffect(() => {
    filtrarAlumnos();
  }, [busqueda, alumnos]);

  const cargarDatosLogro = async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerAlumnosLogro(id);

      if (!resultado.ok) {
        throw new Error(resultado.error || 'Error al cargar datos');
      }

      setLogro(resultado.data.logro);
      setAlumnos(resultado.data.alumnos || []);
      setCargando(false);

    } catch (error) {
      console.error("Error cargando datos del logro:", error);
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
    const filtrados = alumnos.filter(alumno => 
      alumno.email.toLowerCase().includes(busquedaMinuscula)
    );

    setAlumnosFiltrados(filtrados);
  };

  const handleVolver = () => {
    navigate('/admin/logros');
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
          Volver a Logros
        </button>
      </div>

      <div className="admin-page-container logro-detalle-container">
        {cargando ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando información...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <button className="btn-retry" onClick={cargarDatosLogro}>
              Reintentar
            </button>
          </div>
        ) : (
          <>
         
            <div className="logro-info-card">
              <img 
                src={logro?.url_imagen || 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=🏆'} 
                alt={logro?.nombre}
                className="logro-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=🏆';
                }}
              />
              <div className="logro-info">
                <h1 className="logro-titulo">{logro?.nombre}</h1>
                <p className="logro-descripcion">{logro?.descripcion || 'Sin descripción'}</p>
                <div className="logro-stats-badge">
                  <FaTrophy className="trophy-icon" />
                  <span>
                    {alumnos.length} {alumnos.length === 1 ? 'estudiante lo ha' : 'estudiantes lo han'} desbloqueado
                  </span>
                </div>
              </div>
            </div>

         
            <div className="search-section">
              <h2 className="section-title">
                Estudiantes que desbloquearon este logro
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

          
            <div className="table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Fecha de Desbloqueo</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosFiltrados.length > 0 ? (
                    alumnosFiltrados.map((alumno, index) => (
                      <tr key={alumno.id_alumno}>
                        <td>{index + 1}</td>
                        <td className="email-cell">{alumno.email}</td>
                        <td className="fecha-cell">
                          {formatearFecha(alumno.fecha_desbloqueo)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-results-cell">
                        <FaSearch className="no-results-icon" />
                        <p>
                          {busqueda.trim() 
                            ? 'No se encontraron estudiantes con ese criterio' 
                            : 'Ningún estudiante ha desbloqueado este logro aún'}
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