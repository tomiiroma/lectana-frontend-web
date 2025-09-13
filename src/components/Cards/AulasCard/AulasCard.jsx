import { FaChalkboardTeacher, FaEdit, FaEye, FaTrash, FaUsers } from "react-icons/fa";
import "./AulasCard.css";

function AulasCard({mainColor,primaryBtn, secondaryBtnColor,secondaryBtn,title,description,firstItem,secondItem, progress, IconFirstItem, IconSecondItem}) {
  return (
    <>
        <div className="aula-card">
                    <div className="aula-header">
                      <div className="aula-grade" style={mainColor}>{primaryBtn}</div>
                      <div className="aula-status status-active" style={secondaryBtnColor}>{secondaryBtn}</div>
                    </div>
                    <div className="aula-content">
                      <h3 className="aula-title">{title}</h3>
                      <p className="aula-description">{description}</p>
                      
                      <div className="aula-stats">
                        <div className="aula-stat">
      {IconFirstItem && <IconFirstItem className="stat-icon-small" />}
                          <span>{firstItem}</span>
                        </div>
                        <div className="aula-stat">
      {IconSecondItem && <IconSecondItem className="stat-icon-small" />}
                          <span>{secondItem}</span>
                        </div>
                      </div>
                      
                      <div className="aula-progress">
                        <div className="progress-label">Progreso General</div>
                        <div className="progress-bar">
<div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="progress-text">{progress}%</span>
                      </div>
                    </div>
                    <div className="aula-actions">
                      <button className="btn-action btn-view" title="Ver Detalles">
                        <FaEye />
                      </button>
                      <button className="btn-action btn-edit" title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" title="Eliminar">
                        <FaTrash />
                      </button>
                    </div>
                  </div>    
    </>
  );
}

export default AulasCard;
