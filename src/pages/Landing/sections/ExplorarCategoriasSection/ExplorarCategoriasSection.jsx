import CardInfo from "../../../../components/Cards/CardInfo"
import { useNavigate } from "react-router-dom"
import "./ExplorarCategoriasSection.css"
import { FaBook,FaCompass,FaBuildingColumns,FaHeart   } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { MdScience } from "react-icons/md";


function ExplorarCategorias(){
    const navigate = useNavigate();

    const irACatalogo = (categoria) => {
        navigate(`/catalogo?categoria=${encodeURIComponent(categoria)}`);
    };
    return(
        <>
        <section id="categorias" className="container-ExplorarCategorias">
         <h1 className="explorarCategorias-title">Explorar por Categorías</h1>
         <span className="explorarCategorias-text">La app incluye funciones especiales para docentes: gestiona aulas virtuales, asigna lecturas y realiza seguimiento del progreso.</span>
    <div className="container-categorias">
    <CardInfo
        icon={<FaBook size={48} color="lightblue" />}
        titulo="Fantasía"
        descripcion="28 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Fantasía")}
      />      
       <CardInfo
        icon={<FaCompass size={48} color="lightgreen" />}
        titulo="Aventura"
        descripcion="35 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Aventura")}
      /> 
       <CardInfo
        icon={<BsStars size={48} color="lightpurple" />}
        titulo="Misterio"
        descripcion="22 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Misterio")}
      /> 
       <CardInfo
        icon={<MdScience size={48} color="yellow" />}
        titulo="Ciencia"
        descripcion="18 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Ciencia")}
      />   
         <CardInfo
        icon={<FaBuildingColumns size={48} color="gold" />}
        titulo="Historia"
        descripcion="31 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Historia")}
      />   
         <CardInfo
        icon={<FaHeart size={48} color="red" />}
        titulo="Valores"
        descripcion="28 cuentos"
        width={"155px"} height={"155px"}
        onClick={() => irACatalogo("Valores")}
      />   
      </div>
      </section>
        </>
    )
}

export default ExplorarCategorias