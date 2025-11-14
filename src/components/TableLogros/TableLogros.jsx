import { useState } from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './TableLogros.css';

function LogrosTable({ logros = [], onEdit, onDelete, onView }) {
  
const formatearEvento = (evento) => {
    const eventos = {
      'registro': 'Registro',
      'puntos': 'Puntos',
      'compras': 'Compras'
    };
    return eventos[evento] || evento;
  };

  const formatearValor = (evento, valor) => {
    if (evento === 'registro') return 'Registrarse como alumno';
    if (evento === 'puntos') return `Obtener ${valor} puntos`;
    if (evento === 'compras') return `Comprar ${valor} avatar${valor > 1 ? 'es' : ''}`;
    return valor;
  };

  return (
    <div className="logros-table-container">
      <div className="table-wrapper">
        <table className="logros-table">
          <thead>
            <tr>
              <th>Icono</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Evento</th>
              <th>Forma de desbloquear</th>
              <th>Disponible para</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {logros.length > 0 ? (
              logros.map((logro) => (
                <tr key={logro.id_logros}>
                  <td>
                    <img 
                      src={logro.url_imagen} 
                      alt={logro.nombre}
                      className="logro-icon"
                    />
                  </td>
                  <td className="logro-nombre">{logro.nombre}</td>
                  <td className="logro-descripcion">{logro.descripcion}</td>
                  <td>
                    <span className={`badge-evento badge-${logro.evento}`}>
                      {formatearEvento(logro.evento)}
                    </span>
                  </td>
                  <td className="logro-valor">
                    {formatearValor(logro.evento, logro.valor)}
                  </td>
                  <td>
                    <span className="badge-desbloqueados">
                      {logro.desbloqueados} alumnos
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view"
                        onClick={() => onView(logro.id_logros)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => onEdit(logro.id_logros)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => onDelete(logro.id_logros)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  No hay logros para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {logros.length > 0 && (
        <div className="table-footer">
          <p>Total de logros: {logros.length}</p>
        </div>
      )}
    </div>
  );
}

export default LogrosTable;