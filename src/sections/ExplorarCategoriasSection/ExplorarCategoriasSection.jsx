import CardInfo from "../../components/Cards/CardInfo"
import "./ExplorarCategoriasSection.css"
import { FaBook } from "react-icons/fa6";


function ExplorarCategorias(){
    return(
        <>
        <section className="container-ExplorarCategorias">
         <h1 className="explorarCategorias-title">Explorar por Categorías</h1>
         <span className="explorarCategorias-text">La app incluye funciones especiales para docentes: gestiona aulas virtuales, asigna lecturas y realiza seguimiento del progreso.</span>
    <div className="container-categorias">
    <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      />      
       <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      /> 
       <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      /> 
       <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      />   
         <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      />   
         <CardInfo
        icon={<FaBook size={48} />}
        titulo="Fantasía"
        descripcion="28 cuentos"
      />   
      </div>
      </section>
        </>
    )
}

export default ExplorarCategorias