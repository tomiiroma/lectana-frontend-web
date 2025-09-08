import CardInfo from "../../components/Cards/CardInfo"
import "./PorqueLectanaSection.css"
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { FaRegCircleCheck } from "react-icons/fa6";

function PorqueLectanaSection(){
    return(
        <>
            <section className="porqueLectana-container">
            <h1 className="porqueLectana-title">¿Por qué elegir Lectana?</h1>

            <div className="containerBeneficios">
                <ul className="beneficios-list">
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Biblioteca gratuita con más de 500 cuentos</li>
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Audiolibros con IA (voces naturales)</li>
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Experiencia gamificada (quizzes, recompensas)</li>
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Sin registro obligatorio para usar</li>
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Contenido adaptado por edad y nivel</li>
                    <li className="beneficios-item"> <FaRegCircleCheck color="green" size={18}/> Actualizaciones constantes y nuevos cuentos</li>
                </ul>

                <CardInfo icon={<HiOutlineSpeakerWave color="blue" size={64}/>} titulo={"Función Audiolibro"} descripcion={"Disfruta de narraciones con voces naturales. Cada cuento cobra vida con una experiencia auditiva inmersiva y de alta calidad."} width={"500px"} height={"200px"}/>
            </div>
            </section>
        </>
    )
}

export default PorqueLectanaSection