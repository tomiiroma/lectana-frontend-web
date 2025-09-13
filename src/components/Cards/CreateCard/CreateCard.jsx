import { FaPlus } from "react-icons/fa";
import "./CreateCard.css";
import { createCardThemes } from "../../../styles/createCardThemes";

function CreateCard({ title, text, btnText, theme = "red" }) {
  const styles = createCardThemes[theme];

  return (
    <div
      className="actividad-card actividad-create"
      style={{ border: styles.border, background: styles.background }}
    >
      <div className="create-content" style={{ color: styles.color }}>
        <div className="create-icon">
          <FaPlus />
        </div>
        <h3 style={{ color: styles.color }}>{title}</h3>
        <p>{text}</p>
        <button
          className="btn-create"
          style={{ background: styles.buttonBackground }}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}

export default CreateCard;
