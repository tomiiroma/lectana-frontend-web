import { useState, useEffect } from "react";
import { obtenerCuentoDestacado } from "../../api/cuentos";
import "./CardLibro.css";

function CardLibro({ cuento: cuentoProp }) {
  const [cuentoDestacado, setCuentoDestacado] = useState(null);
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (!cuentoProp) {
      cargarCuentoDestacado();
    }
  }, [cuentoProp]);

  const cargarCuentoDestacado = async () => {
    try {
      setLoading(true);
      const data = await obtenerCuentoDestacado();
      setCuentoDestacado(data);
    } catch (error) {
      console.error("Error al cargar cuento destacado:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const cuento = cuentoProp || cuentoDestacado;

  
  if (!cuentoProp && loading) {
    return (
      <div className="card">
        <div className="card-image" style={{ background: "#f0f0f0", height: "200px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

 
  if (!cuento) {
    return (
      <div className="card">
        <div className="card-image">
          <img 
            src="https://fakeimg.pl/350x200/?text=Sin+Imagen&font=lobster" 
            alt="Placeholder"
          />
          <div className="card-badge">Disponible en la App</div>
        </div>
        <div className="card-content">
          <h3 className="card-title">Cuento no disponible</h3>
          <p className="card-author">Autor desconocido</p>
        </div>
      </div>
    );
  }

  
  const edadTexto = `${cuento.edad_publico}+ años`;
  
  const duracionTexto = cuento.audio_duration 
    ? `${cuento.audio_duration} min` 
    : (cuento.duracion || "20 minutos");



  return (
    <div className="card">
      <div className="card-image">
        <img 
          src={cuento.url_img || "https://fakeimg.pl/350x200/?text=Sin+Imagen&font=lobster"} 
          alt={cuento.titulo}
        />
        <div className="card-badge">Disponible en la App</div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{cuento.titulo}</h3>
        <p className="card-author">
          {cuento.autor?.nombre} {cuento.autor?.apellido}
        </p>
        <div className="card-info">
          <span className="card-age">{edadTexto}</span>
          <div className="card-stats">
            <span className="card-duration">Duración: {duracionTexto}</span>
          </div>
        </div>
        <p className="card-description">
          Género: {cuento.genero?.nombre || "Sin género"}
        </p>
        <button className="card-button">Disponible para leer en la app móvil</button>
      </div>
    </div>
  );
}

export default CardLibro;