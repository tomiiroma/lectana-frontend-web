import { FaPlus, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import styles from "./AdminActionsBar.module.css";

function AdminActionsBar({
  btnTitle,
  placeholderTitle,
  onNew,
  onBtnClick,
  onSearch,
  onFilter,
  onExport,
  btnClassName,
  btnStyle
}) {
  return (
    <div className={styles.adminActionsBar}>
      <button className={styles[btnClassName]} onClick={onBtnClick || onNew}  style={btnStyle}>
        <FaPlus /> {btnTitle}
      </button>

      <div className={styles.searchFilterGroup}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder={placeholderTitle}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <button className={styles.btnSecondary} onClick={onFilter}>
          <FaFilter /> Filtros
        </button>

        <button className={styles.btnSecondary} onClick={onExport}>
          <FaDownload /> Exportar
        </button>
      </div>
    </div>
  );
}

export default AdminActionsBar;
