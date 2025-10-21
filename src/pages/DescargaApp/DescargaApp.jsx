import { Link } from "react-router-dom";
import { FaArrowLeft, FaDownload, FaAndroid, FaQrcode } from "react-icons/fa";
import "./DescargaApp.css";

function DescargaApp() {
  // URL de descarga de la APK (puedes cambiar esta URL por la real)
  const downloadUrl = "https://lectana-app.com/download/lectana.apk";
  
  // URL del QR code - usando imagen local
  const qrCodeUrl = "/qr-lectana-app.png";

  const handleDirectDownload = () => {
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="descarga-app-container">
      <div className="descarga-app-content">
        {/* Header con botón de regreso */}
        <div className="descarga-header">
          <Link to="/" className="back-button">
            <FaArrowLeft />
            <span>Volver al inicio</span>
          </Link>
        </div>

        {/* Contenido principal */}
        <div className="descarga-main">
          <div className="descarga-info">
            <div className="app-icon">
              <img src="/lectana.svg" alt="Lectana App" className="app-logo" />
            </div>
            
            <h1 className="descarga-title">Descarga Lectana</h1>
            <p className="descarga-subtitle">
              La aplicación de cuentos infantiles más completa
            </p>

            <div className="app-features">
              <div className="feature">
                <FaAndroid className="feature-icon" />
                <span>Compatible con Android</span>
              </div>
              <div className="feature">
                <span className="feature-badge">Gratis</span>
                <span>Sin anuncios ni compras</span>
              </div>
              <div className="feature">
                <span className="feature-badge">Nuevo</span>
                <span>Actualizaciones constantes</span>
              </div>
            </div>
          </div>

          {/* Sección del QR */}
          <div className="qr-section">
            <div className="qr-container">
              <div className="qr-header">
                <FaQrcode className="qr-icon" />
                <h3>Escanea para descargar</h3>
              </div>
              
              <div className="qr-code">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code para descargar Lectana" 
                  className="qr-image"
                />
              </div>
              
              <p className="qr-instructions">
                Apunta tu cámara al código QR para descargar directamente
              </p>
            </div>

            <div className="download-divider">
              <span>o</span>
            </div>

            {/* Botón de descarga directa */}
            <button 
              onClick={handleDirectDownload}
              className="download-button"
            >
              <FaDownload />
              <span>Descargar APK Directamente</span>
            </button>
          </div>
        </div>

        {/* Footer de información */}
        <div className="descarga-footer">
          <div className="security-info">
            <h4>Información de seguridad</h4>
            <ul>
              <li>✓ Aplicación oficial de Lectana</li>
              <li>✓ Sin virus ni malware</li>
              <li>✓ Descarga segura y verificada</li>
              <li>✓ No requiere permisos especiales</li>
            </ul>
          </div>
          
          <div className="version-info">
            <p><strong>Versión:</strong> 1.0.0</p>
            <p><strong>Tamaño:</strong> ~15 MB</p>
            <p><strong>Requisitos:</strong> Android 5.0+</p>
            <p><strong>Última actualización:</strong> Octubre 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescargaApp;