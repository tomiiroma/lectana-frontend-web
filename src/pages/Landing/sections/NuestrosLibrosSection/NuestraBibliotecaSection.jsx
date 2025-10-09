import { useState, useEffect } from "react"
import "./NuestraBibliotecaSection.css"
import CardLibro from "../../../../components/Cards/CardLibro"
import { Link } from "react-router-dom"
import { obtenerCuentos } from "../../../../api/cuentos"

function NuestraBibliotecaSection(){
    const [cuentos, setCuentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarCuentos();
    }, []);

    const cargarCuentos = async () => {
        try {
            setLoading(true);
            const response = await obtenerCuentos({ limit: 6, page: 1 });
            setCuentos(response.data || []);
        } catch (error) {
            console.error("Error al cargar cuentos:", error);
            // Si hay error, mantener array vacío
            setCuentos([]);
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
        <section id="biblioteca" className="container-NuestraBibliotecaSection">
        <h1 className="NuestraBibliotecaSection-title">Nuestra Biblioteca</h1>
        <span className="NuestraBibliotecaSection-text">Explora una muestra de los cientos de cuentos disponibles en la app. Cada libro está cuidadosamente seleccionado y adaptado por edad.</span>

     <div className="cardsLibro-grid">
                {loading ? (
                    // Mostrar skeleton loaders mientras carga
                    [...Array(6)].map((_, index) => (
                        <CardLibro key={`skeleton-${index}`} />
                    ))
                ) : cuentos.length > 0 ? (
                    // Mostrar cuentos reales del backend
                    cuentos.map((cuento) => (
                        <CardLibro 
                            key={cuento.id} 
                            cuento={cuento}
                        />
                    ))
                ) : (
                    // Mostrar placeholders si no hay cuentos
                    [...Array(6)].map((_, index) => (
                        <CardLibro key={`placeholder-${index}`} />
                    ))
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
