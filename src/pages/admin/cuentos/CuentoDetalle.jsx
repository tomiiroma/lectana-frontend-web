import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerCuentoPorId } from "../../../api/cuentos";
import AudioPlayer from "../../../components/AudioPlayer/AudioPlayer";
import "../AdminPages.css";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function CuentoDetalle() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const defaultLayout = defaultLayoutPlugin();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const d = await obtenerCuentoPorId(id);
        setData(d);
      } catch (e) {
        setError(e.message || "Error cargando cuento");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="admin-page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 className="admin-page-title">📖 Detalle del Cuento</h1>
        <Link to="/admin/cuentos" className="btn-secondary" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 8 }}>Volver</Link>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}

      {!loading && !error && data && (
        <div>
          {/* Información del cuento */}
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ background: "#0b1220", borderRadius: 12, padding: 16 }}>
              <div style={{ width: "100%", paddingTop: "56%", background: `url(${data.url_img || ''}) center/cover no-repeat`, borderRadius: 8, marginBottom: 12 }} />
              <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700 }}>{data.titulo}</div>
              <div style={{ color: "#94a3b8", marginTop: 4 }}>{data.genero?.nombre || "-"}</div>
              <div style={{ color: "#94a3b8", marginTop: 4 }}>{data.autor ? `${data.autor.nombre} ${data.autor.apellido}` : "-"}</div>
              <div style={{ color: "#94a3b8", marginTop: 4 }}>Edad: {data.edad_publico ?? "-"}</div>
            </div>

            <div style={{ background: "#0b1220", borderRadius: 12, padding: 8, minHeight: 520 }}>
              {data.pdf_url ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={data.pdf_url} plugins={[defaultLayout]} />
                </Worker>
              ) : (
                <div style={{ color: "#94a3b8", padding: 16 }}>Este cuento no tiene PDF.</div>
              )}
            </div>
          </div>

          {/* Reproductor de audio */}
          <AudioPlayer 
            cuentoId={parseInt(id)} 
            isAdmin={true}
            onAudioDeleted={() => {
              console.log('Audio eliminado para cuento:', id);
            }}
          />
        </div>
      )}
    </div>
  );
}


