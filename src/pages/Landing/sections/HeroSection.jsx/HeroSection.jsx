import SecondaryButton from "../../../../components/Buttons/SecondaryButton"
import CardLibro from "../../../../components/Cards/CardLibro"
import { Link } from "react-router-dom"
import "./HeroSection.css"

function HeroSection() {
  return (
    <section className="container-heroSection">
      <div className="heroSection-wrapper">
        <div className="content-heroSection">
        <h1 className="heroSection-title">Tu biblioteca digital <span> <br/>favorita</span></h1>
        <p className="heroSection-text">Descubrí cuentos adaptados por edad. Descarga la app y accede gratis</p>
        <div className="buttons-heroSection">
        <Link to="/descarga-app" className="PrimaryButton">Descargar App Gratis</Link>
        <SecondaryButton content={"Ver demo de la App"}/>
        </div>
        </div>
        <CardLibro/>
      </div>
    </section>
  )
}

export default HeroSection