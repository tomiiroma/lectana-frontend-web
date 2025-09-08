import CardInfo from "../../components/Cards/CardInfo"
import "./ExplorarCategoriasSection.css"
import { FaBook,FaCompass,FaBuildingColumns,FaHeart   } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { MdScience } from "react-icons/md";


function ExplorarCategorias(){
    return(
        <>
        <section className="container-ExplorarCategorias">
         <h1 className="explorarCategorias-title">Explorar por Categorías</h1>
         <span className="explorarCategorias-text">La app incluye funciones especiales para docentes: gestiona aulas virtuales, asigna lecturas y realiza seguimiento del progreso.</span>
    <div className="container-categorias">
    <CardInfo
        icon={<FaBook size={48} color="lightblue" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
                width={"155px"} height={"155px"}

      />      
       <CardInfo
        icon={<FaCompass size={48} color="lightgreen" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
                width={"155px"} height={"155px"}

      /> 
       <CardInfo
        icon={<BsStars size={48} color="lightpurple" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
                width={"155px"} height={"155px"}

      /> 
       <CardInfo
        icon={<MdScience size={48} color="yellow" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
        width={"155px"} height={"155px"}
      />   
         <CardInfo
        icon={<FaBuildingColumns size={48} color="gold" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
                width={"155px"} height={"155px"}

      />   
         <CardInfo
        icon={<FaHeart size={48} color="red" />}
        titulo="Valores"
        descripcion="28 cuentos"
                width={"155px"} height={"155px"}

      />   
      </div>
      </section>
        </>
    )
}

export default ExplorarCategorias