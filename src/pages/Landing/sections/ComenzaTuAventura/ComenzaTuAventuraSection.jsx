import SecondaryButton from "../../../../components/Buttons/SecondaryButton"
import "./ComenzaTuAventuraSection.css"

function ComenzaTuAventuraSection(){
    return(
        <>
            <section className="comenzaTuAventura-container">
                <h1 className="comenzaTuAventura-title">Comenzá tu aventura de lectura</h1>
                <span className="comenzaTuAventura-text">Descargá Lectana y accedé a cientos de cuentos desde tu móvil. ¡Completamente gratis, sin anuncios y con actualizaciones constantes!</span>

                <div className="comenzaTuAventura-buttons">
                    <SecondaryButton content={"Descargar de Play Store"}/>
                    <SecondaryButton content={"Ver Screenshots"}/>
                </div>

                <p className="publicidad-text">Solo disponible para Android • Sin anuncios • Actualizaciones constantes</p>
            </section>
        </>
    )
}

export default ComenzaTuAventuraSection;