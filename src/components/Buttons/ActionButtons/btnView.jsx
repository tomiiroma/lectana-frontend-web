import { FaEye } from "react-icons/fa";
import styles from "./btnActions.module.css"; 

function BtnView({ onClickAction }) {
  return (
    <button
      className={`${styles.btnAction} ${styles.btnView}`}
      title="Ver Detalles"
      onClick={onClickAction}
    >
      <FaEye />
    </button>
  );
}

export default BtnView;
