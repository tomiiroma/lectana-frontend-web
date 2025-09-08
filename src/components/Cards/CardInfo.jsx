import "./CardInfo.css"

function CardInfo({icon, titulo, descripcion, width, height}){

      const style = {
    width: width,
    height: height ,
  };
    return(
        <>
    <div className="card-categoria" style={style}>
      {icon}
      <h3 className="cardCategoria-title">{titulo}</h3>
      <p className="cardCategoria-description">{descripcion}</p>
    </div>

        </>
    )
}

export default CardInfo