//TABLA DE EJEMPLO, UTILIZAR OTRA DESPUES

import "./TableExample.css";

function TableExample() {
  return (
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Ana Gómez</td>
          <td>ana@example.com</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Carlos Pérez</td>
          <td>carlos@example.com</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Lucía Fernández</td>
          <td>lucia@example.com</td>
        </tr>
      </tbody>
    </table>
  );
}

export default TableExample;
