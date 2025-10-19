import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaTrophy } from 'react-icons/fa';
import '../AdminPages.css';
import './LogroDetalle.css';

export default function LogroDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [logro, setLogro] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatosLogro();
  }, [id]);

  useEffect(() => {
    filtrarUsuarios();
  }, [busqueda, usuarios]);

  const cargarDatosLogro = async () => {
    setCargando(true);
    setError(null);
    try {
    

      const logroMock = {
        id_logros: parseInt(id),
        nombre: "Primer Libro Leído",
        descripcion: "Completa tu primera lectura en la plataforma",
        url_imagen: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=📚",
        total_desbloqueados: 45
      };

      const usuariosMock = [
        {
          id: 1,
          email: "ana.garcia@ejemplo.com",
          fecha_desbloqueo: "2024-01-15"
        },
        {
          id: 2,
          email: "carlos.perez@ejemplo.com",
          fecha_desbloqueo: "2024-01-20"
        },
        {
          id: 3,
          email: "maria.lopez@ejemplo.com",
          fecha_desbloqueo: "2024-02-05"
        },
        {
          id: 4,
          email: "juan.martinez@ejemplo.com",
          fecha_desbloqueo: "2024-02-10"
        },
        {
          id: 5,
          email: "laura.rodriguez@ejemplo.com",
          fecha_desbloqueo: "2024-02-15"
        },
        {
          id: 6,
          email: "pedro.sanchez@ejemplo.com",
          fecha_desbloqueo: "2024-02-20"
        },
        {
          id: 7,
          email: "sofia.fernandez@ejemplo.com",
          fecha_desbloqueo: "2024-03-01"
        },
        {
          id: 8,
          email: "diego.torres@ejemplo.com",
          fecha_desbloqueo: "2024-03-05"
        }
      ];

      setTimeout(() => {
        setLogro(logroMock);
        setUsuarios(usuariosMock);
        setCargando(false);
      }, 500);

    } catch (error) {
      console.error("Error cargando datos del logro:", error);
      setError(`Error al cargar los datos: ${error.message || 'Error de conexión'}`);
      setCargando(false);
    }
  };

  const filtrarUsuarios = () => {
    if (!busqueda.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const busquedaMinuscula = busqueda.toLowerCase();
    const filtrados = usuarios.filter(usuario => 
      usuario.email.toLowerCase().includes(busquedaMinuscula)
    );

    setUsuariosFiltrados(filtrados);
  };

  const handleVolver = () => {
    navigate('/admin/logros');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
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
                src={logro?.url_imagen} 
                alt={logro?.nombre}
                className="logro-image"
              />
              <div className="logro-info">
                <h1 className="logro-titulo">{logro?.nombre}</h1>
                <p className="logro-descripcion">{logro?.descripcion}</p>
                <div className="logro-stats-badge">
                  <FaTrophy className="trophy-icon" />
                  <span>{logro?.total_desbloqueados} estudiantes lo han desbloqueado</span>
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
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario, index) => (
                      <tr key={usuario.id}>
                        <td>{index + 1}</td>
                        <td className="email-cell">{usuario.email}</td>
                        <td className="fecha-cell">{formatearFecha(usuario.fecha_desbloqueo)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-results-cell">
                        <FaSearch className="no-results-icon" />
                        <p>No se encontraron estudiantes</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

   
            {usuariosFiltrados.length > 0 && (
              <div className="table-footer">
                <p>Mostrando {usuariosFiltrados.length} de {usuarios.length} estudiantes</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}