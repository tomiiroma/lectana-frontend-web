import "./CardDashboard.css"

function CardDashboard({title, content, action}){
    return (
        <>
        <div className="CardDashboard-container">
            <div className="cardDashboard-head">
            <h1>{title}</h1>
            <a href="">{action}</a>
            </div>
            <div className="cardDashboard-content">
                {content}
            </div>
        </div>
        </>
    )
}

export default CardDashboard;