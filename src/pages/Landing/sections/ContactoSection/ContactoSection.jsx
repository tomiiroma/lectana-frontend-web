import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import "./ContactoSection.css"
import { MdMailOutline, MdOutlinePhone, MdOutlineLocationOn } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";

function ContactoSection() {
    return (
        <>
            <section className="contactoSection-container">
                <div className="infoContacto-container">
                    <h1 className="infoContacto-title">Conecta con nosotros</h1>
                    <p className="infoContacto-text">¿Tienes preguntas sobre Lectana? ¿Eres docente y quieres saber más sobre nuestras herramientas educativas? ¡Nos encantaría escucharte!</p>
                    <ul className="infoContacto-list">
                        <li className="infoContacto-item"><MdMailOutline color="blue" size={16} /> contacto@lectana.com</li>
                        <li className="infoContacto-item"><MdOutlinePhone color="blue" size={16} /> +54 11 1234-5678</li>
                        <li className="infoContacto-item"><MdOutlineLocationOn color="blue" size={16} /> Buenos Aires, Argentina</li>
                    </ul>
                </div>
                <div className="formContacto-container">
                    <h1 className="formContacto-title">Formulario de Contacto</h1>
                    <form action="">
                        <div className="container-formGroup"> 
                            <label htmlFor="" className="formContacto-label">Nombre *</label>
                            <input className="formContacto-input" type="text" placeholder="Tu Nombre Completo" />
                        </div>

                        <div className="container-formGroup">
                            <label htmlFor="" className="formContacto-label">Email *</label>
                            <input className="formContacto-input" type="text" placeholder="tu@email.com" />
                        </div>


                        <div className="container-formGroup">
                            <label htmlFor="" className="formContacto-label">Institucion(opcional)</label>
                            <input className="formContacto-input" type="text" placeholder="Nombre de tu Escuela o Institucion" />
                        </div>

                        <div className="container-formGroup">
                            <label htmlFor="" className="formContacto-label">Mensaje *</label>
                            <textarea className="formContacto-textarea" placeholder="Cuentanos como podemos ayudarte ..." />
                        </div>

                        <PrimaryButton content={"Enviar Mensaje"} className="btn-enviarForm"/>
                    </form>

                </div>
            </section>
        </>
    )
}

export default ContactoSection;