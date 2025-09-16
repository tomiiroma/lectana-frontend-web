import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import styles from "./AdminActionsBar.module.css";

function AdminActionsBar({
  btnTitle,
  placeholderTitle,
  onNew,
  onBtnClick,
  onSearch,
  onFilter,
  btnClassName,
  btnStyle,
  additionalButtons = []
}) {
  return (
    <div className={styles.adminActionsBar}>
      <div className={styles.actionButtonsGroup}>
        <button className={styles[btnClassName]} onClick={onBtnClick || onNew}  style={btnStyle}>
          <FaPlus /> {btnTitle}
        </button>
        
        {additionalButtons.map((btn, index) => (
          <button 
            key={index}
            className={styles[btn.className]} 
            onClick={btn.onClick} 
            style={btn.style}
          >
            {btn.icon} {btn.title}
          </button>
        ))}
      </div>

      {(placeholderTitle || onSearch || onFilter) && (
        <div className={styles.searchFilterGroup}>
          {placeholderTitle && onSearch && (
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder={placeholderTitle}
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          )}

          {onFilter && (
            <button className={styles.btnSecondary} onClick={onFilter}>
              <FaFilter /> Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminActionsBar;
