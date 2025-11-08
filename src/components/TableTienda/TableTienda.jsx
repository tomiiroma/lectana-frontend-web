import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './TableTienda.css';

function TiendaTable({ items = [], onEdit, onDelete, onView, searchTerm }) {
  return (
    <div className="tienda-table-container">
      <div className="table-wrapper">
        <table className="tienda-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id_item}>
                  <td>
                    <img 
                      src={item.url_imagen} 
                      alt={item.nombre}
                      className="avatar-preview"
                    />
                  </td>
                  <td className="avatar-nombre">{item.nombre}</td>
                  <td className="avatar-descripcion">{item.descripcion}</td>
                  <td>
                    <span className="badge-precio">
                      {item.precio} pts
                    </span>
                  </td>
                   <td>
                    <span className={`badge-estado ${item.disponible ? 'disponible' : 'no-disponible'}`}>
                      {item.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view"
                        onClick={() => onView(item.id_item)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => onEdit(item.id_item)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => onDelete(item.id_item)}
                        title={item.disponible ? 'Deshabilitar' : 'Habilitar'}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-message">
                  {searchTerm 
                    ? `No hay avatares que coincidan con "${searchTerm}"`
                    : 'No hay avatares creados actualmente'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <div className="table-footer">
          <p>Total de avatares: {items.length}</p>
        </div>
      )}
    </div>
  );
}

export default TiendaTable;