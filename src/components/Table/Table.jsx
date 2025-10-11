import BtnDelete from "../Buttons/ActionButtons/btnDelete";
import BtnEdit from "../Buttons/ActionButtons/btnEdit";
import BtnView from "../Buttons/ActionButtons/btnView";
import "./Table.css"

function Table({ items = [], columns = [], onVer, onEditar,onDelete, tipo , headerColor }) {
  return (
    <div className="tabla-wrapper">
      <table className="tabla">
        <thead style={{ background: headerColor }}>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="no-registros">
                No hay {tipo} registrados.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.accessor}>{item[col.accessor]}</td>
                ))}
                <td className="acciones-tabla">
                    <BtnView onClickAction={onVer}/>
                    <BtnEdit onClickAction={onEditar}/>
                    <BtnDelete onClickAction={onDelete}/>

                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
