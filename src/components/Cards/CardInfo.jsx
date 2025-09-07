import "./CardInfo.css"

function CardInfo({icon, titulo, descripcion}){
    return(
        <>
    <div className="card-info">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{titulo}</h3>
      <p className="card-description">{descripcion}</p>
    </div>

        </>
    )
}

export default CardInfo