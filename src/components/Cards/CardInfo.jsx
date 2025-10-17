import "./CardInfo.css"

function CardInfo({icon, titulo, descripcion, width, height, onClick}){

      const style = {
    width: width,
    height: height ,
  };
    return(
        <>
    <div 
      className="card-categoria" 
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {icon}
      <h3 className="cardCategoria-title">{titulo}</h3>
      <p className="cardCategoria-description">{descripcion}</p>
    </div>

        </>
    )
}

export default CardInfo