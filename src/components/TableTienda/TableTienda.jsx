import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import './TableTienda.css';

function TiendaTable({ avatares = [], onEdit, onDelete, onView }) {
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
              <th>Comprados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {avatares.length > 0 ? (
              avatares.map((avatar) => (
                <tr key={avatar.id_avatar}>
                  <td>
                    <img 
                      src={avatar.url_imagen} 
                      alt={avatar.nombre}
                      className="avatar-preview"
                    />
                  </td>
                  <td className="avatar-nombre">{avatar.nombre}</td>
                  <td className="avatar-descripcion">{avatar.descripcion}</td>
                  <td>
                    <span className="badge-precio">
                      {avatar.precio} pts
                    </span>
                  </td>
                  <td>
                    <span className="badge-comprados">
                      {avatar.comprados || 0} alumnos
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-action btn-view"
                        onClick={() => onView(avatar.id_avatar)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-action btn-edit"
                        onClick={() => onEdit(avatar.id_avatar)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => onDelete(avatar.id_avatar)}
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
                <td colSpan="6" className="no-results">
                  No hay avatares para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {avatares.length > 0 && (
        <div className="table-footer">
          <p>Total de avatares: {avatares.length}</p>
        </div>
      )}
    </div>
  );
}

export default TiendaTable;
