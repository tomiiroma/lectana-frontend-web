import "./CardCounter.css"

function CardCounter({title, data, Icon}){
    return(
        <>
        <div className="CardCounter-container">
            <div className="CardCounter-head">
            <span className="CardCounter-title">{title}</span>
        {Icon && <Icon color="#0056d2" />} 

            </div>
            <h1 className="CardCounter-data">{data}</h1>
        </div>
        </>
    )
}

export default CardCounter;