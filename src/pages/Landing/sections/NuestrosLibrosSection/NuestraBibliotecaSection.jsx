import { useState, useEffect } from "react"
import "./NuestraBibliotecaSection.css"
import CardLibro from "../../../../components/Cards/CardLibro"
import { Link } from "react-router-dom"
import { obtenerCuentosPublicos } from "../../../../api/cuentos"

function NuestraBibliotecaSection(){
    const [cuentos, setCuentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCuentos();
    }, []);

    const cargarCuentos = async () => {
        try {
            setLoading(true);
           
            const response = await obtenerCuentosPublicos({ 
                limite: 10,  
                pagina: 1 
            });
            
            
            console.log("Respuesta completa:", response);
            console.log("Cuentos recibidos:", response.cuentos);
            console.log("Cantidad de cuentos:", response.cuentos?.length);
            
            
            const cuentosUnicos = response.cuentos || [];
            const primeros6 = cuentosUnicos.slice(1, 7);
            
            console.log("Mostrando estos 6 cuentos:", primeros6);
            
            setCuentos(primeros6);
        } catch (error) {
            console.error("Error al cargar cuentos:", error);
            setCuentos([]);
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
        <section id="biblioteca" className="container-NuestraBibliotecaSection">
            <h1 className="NuestraBibliotecaSection-title">Nuestra Biblioteca</h1>
            <span className="NuestraBibliotecaSection-text">
                Explora una muestra de los cientos de cuentos disponibles en la app. 
                Cada libro está cuidadosamente seleccionado y adaptado por edad.
            </span>

            <div className="cardsLibro-grid">
                {loading ? (
                    
                    [...Array(6)].map((_, index) => (
                        <CardLibro key={`skeleton-${index}`} />
                    ))
                ) : cuentos.length > 0 ? (
                   
                    cuentos.map((cuento) => (
                        <CardLibro 
                            key={cuento.id_cuento}
                            cuento={cuento}
                        />
                    ))
                ) : (
                    
                    <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '2rem' 
                    }}>
                        <p>No hay cuentos disponibles en este momento.</p>
                    </div>
                )}
            </div>

            <h2 className="ad-title">¿Querés leer estos cuentos?</h2>
            <span className="ad-text">Accedé a toda la biblioteca desde tu móvil.</span>
            <Link to="/descarga-app" className="PrimaryButton">Descargar App</Link>
        </section>
        </>
    )
}

export default NuestraBibliotecaSection