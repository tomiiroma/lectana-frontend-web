import CardInfo from "../../components/Cards/CardInfo"
import "./HerramientasDocentesSection.css"
import { FaUsers } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import { IoIosStats } from "react-icons/io";

function HerramientasDocentesSection(){
    return(
        <>
        <section className="container-herramientasDocentes">
            <h1 className="herramientasDocentes-title">Herramientas para Docentes</h1>
            <p className="herramientasDocentes-text">La app incluye funciones especiales para docentes: gestiona aulas virtuales, asigna lecturas y realiza seguimiento del progreso.</p>
        
            <div className="cards-Herramientas">
                <CardInfo
                icon={<FaUsers size={64} color="blue"/>}
                titulo={"Gestión de Aulas"}
                descripcion={"Creación de aulas virtuales, códigos de acceso y gestión de múltiples cursos de forma sencilla."}
                width={"250px"}
                height={"330px"}
                />

                   <CardInfo
                icon={<MdAssignment size={64} color="green"/>}
                titulo={"Asignación de Lecturas"}
                descripcion={"Filtros por edad, progreso y contenido curado para cada nivel."}
                width={"250px"}
                height={"330px"}
                />

                <CardInfo
                icon={<IoIosStats size={64} color="orange"/>}
                titulo={"Seguimiento del Progreso"}
                descripcion={"Reportes detallados, retroalimentación personalizada y actividades interactivas para evaluar."}
                width={"250px"}
                height={"330px"}
                />
            </div>

        </section>

        </>
    )
}

export default HerramientasDocentesSection