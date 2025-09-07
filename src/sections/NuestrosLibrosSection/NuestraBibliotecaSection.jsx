import "./NuestraBibliotecaSection.css"
import CardLibro from "../../components/Cards/CardLibro"
import PrimaryButton from "../../components/Buttons/PrimaryButton"

function NuestraBibliotecaSection(){
    return(
        <>
        <section className="container-NuestraBibliotecaSection">
        <h1 className="NuestraBibliotecaSection-title">Nuestra Biblioteca</h1>
        <span className="NuestraBibliotecaSection-text">Explora una muestra de los cientos de cuentos disponibles en la app. Cada libro está cuidadosamente seleccionado y adaptado por edad.</span>

     <div className="cardsLibro-grid">
                {[...Array(6)].map((_, index) => (
                    <CardLibro key={index} />
                ))}
            </div>

            <h2 className="ad-title">¿Querés leer estos cuentos?</h2>
            <span className="ad-text">Accedé a toda la biblioteca desde tu móvil.</span>
            <PrimaryButton content={"Descargar App"}/>
        </section>
        </>
    )
}

export default NuestraBibliotecaSection
