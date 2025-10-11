import { FaEdit } from "react-icons/fa";
import styles from "./btnActions.module.css"; 

function BtnEdit({ onClickAction }) {
  return (
    <button
      className={`${styles.btnAction} ${styles.btnEdit}`} 
      title="Editar"
      onClick={onClickAction}
    >
      <FaEdit />
    </button>
  );
}

export default BtnEdit;