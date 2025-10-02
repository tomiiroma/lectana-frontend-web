import { FaTrash } from "react-icons/fa";
import styles from "./btnActions.module.css"; 

function BtnDelete({ onClickAction }) {
  return (
    <button
      className={`${styles.btnAction} ${styles.btnDelete}`} 
      title="Eliminar"
      onClick={onClickAction}
    >
      <FaTrash />
    </button>
  );
}

export default BtnDelete;
