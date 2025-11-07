import CardInfo from "../../../../components/Cards/CardInfo"
import { useNavigate } from "react-router-dom"
import "./ExplorarCategoriasSection.css"
import { FaBook,FaCompass,FaBuildingColumns,FaHeart   } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { MdScience } from "react-icons/md";
import { obtenerGenerosPublicos } from "../../../../api/generos"
import { obtenerCuentosPublicos } from "../../../../api/cuentos"
import { useState, useEffect } from "react";


function ExplorarCategorias(){
    const navigate = useNavigate(); 
    const [generos, setGeneros] = useState([]);
    const [contadorCuentos, setContadorCuentos] = useState({});
    const [loading, setLoading] = useState(true);

    
    const iconosGeneros = {
        "fantasia": <FaBook size={48} color="lightblue" />,
        "aventura": <FaCompass size={48} color="lightgreen" />,
        "misterio": <BsStars size={48} color="purple" />,
        "ciencia": <MdScience size={48} color="gold" />,
        "historia": <FaBuildingColumns size={48} color="sienna" />,
        "valores": <FaHeart size={48} color="red" />,
        "realista": <FaBook size={48} color="teal" />,
        "default": <FaBook size={48} color="gray" />
    };

       useEffect(() => {
        cargarGenerosYCuentos();
    }, []);

     const cargarGenerosYCuentos = async () => {
        try {
            setLoading(true);
            
            
            const generosData = await obtenerGenerosPublicos();
            console.log("Géneros obtenidos:", generosData);
            
           
            const cuentosData = await obtenerCuentosPublicos({ limite: 100 });
            const todosCuentos = cuentosData.cuentos || [];
            
            
            const contador = {};
            generosData.forEach(genero => {
                const cantidad = todosCuentos.filter(
                    cuento => cuento.genero?.nombre?.toLowerCase() === genero.nombre.toLowerCase()
                ).length;
                contador[genero.nombre] = cantidad;
            });
            
            setGeneros(generosData);
            setContadorCuentos(contador);
        } catch (error) {
            console.error("Error al cargar géneros:", error);
        } finally {
            setLoading(false);
        }
    };

    const irACatalogo = (categoria) => {
        navigate(`/catalogo?categoria=${encodeURIComponent(categoria)}`);
    };

  const obtenerIcono = (nombreGenero) => {
        const key = nombreGenero.toLowerCase();
        return iconosGeneros[key] || iconosGeneros.default;
    };

     if (loading) {
        return (
            <section id="categorias" className="container-ExplorarCategorias">
                <h1 className="explorarCategorias-title">Explorar por Categorías</h1>
                <span className="explorarCategorias-text">
                    La app incluye funciones especiales para docentes: gestiona aulas virtuales, 
                    asigna lecturas y realiza seguimiento del progreso.
                </span>
                <div className="container-categorias">
                    <p>Cargando categorías...</p>
                </div>
            </section>
        );
    }

    return(
        <>
        <section id="categorias" className="container-ExplorarCategorias">
         <h1 className="explorarCategorias-title">Explorar por Categorías</h1>
         <span className="explorarCategorias-text">La app incluye funciones especiales para docentes: gestiona aulas virtuales, asigna lecturas y realiza seguimiento del progreso.</span>
    <div className="container-categorias">
     {generos.length > 0 ? (
                    generos.map((genero) => (
                        <CardInfo
                            key={genero.id_genero}
                            icon={obtenerIcono(genero.nombre)}
                            titulo={genero.nombre}
                            descripcion={`${contadorCuentos[genero.nombre] || 0} cuentos`}
                            width={"155px"}
                            height={"155px"}
                            onClick={() => irACatalogo(genero.nombre)}
                        />
                    ))
                ) : (
                    <p>No hay categorías disponibles</p>
                )}
      </div>
      </section>
        </>
    )
}

export default ExplorarCategorias