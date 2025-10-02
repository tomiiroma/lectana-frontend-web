import React, { useEffect, useState } from "react";
import { FaTimes, FaSave, FaEye } from "react-icons/fa";
import "./EditStoryModal.css";
import { obtenerCuentoPorId, editarCuento, subirPDFCuentoV2, subirImagenCuento } from "../../../api/cuentos";
import { listarAutores } from "../../../api/autores";
import { listarGeneros } from "../../../api/generos";

export default function EditStoryModal({ isOpen, onClose, cuentoId, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cuento, setCuento] = useState(null);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [formData, setFormData] = useState({
    titulo: "",
    edad_publico: "",
    autor_id_autor: "",
    genero_id_genero: "",
    duracion: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!isOpen || !cuentoId) return;
    
    (async () => {
      setLoading(true);
      setErrors({});
      try {
        // Cargar datos del cuento y combos
        const [cuentoData, autoresData, generosData] = await Promise.all([
          obtenerCuentoPorId(cuentoId),
          listarAutores(),
          listarGeneros()
        ]);
        
        setCuento(cuentoData);
        setAutores(autoresData || []);
        setGeneros(generosData || []);
        
        // Pre-poblar formulario
        setFormData({
          titulo: cuentoData.titulo || "",
          edad_publico: cuentoData.edad_publico || "",
          autor_id_autor: cuentoData.autor_id_autor || "",
          genero_id_genero: cuentoData.genero_id_genero || "",
          duracion: cuentoData.duracion || "",
        });
      } catch (e) {
        setErrors({ submit: e.message || "Error cargando datos" });
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, cuentoId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }
    
    if (!formData.autor_id_autor) {
      newErrors.autor_id_autor = "Autor requerido";
    }
    
    if (!formData.genero_id_genero) {
      newErrors.genero_id_genero = "Género requerido";
    }
    
    const edad = Number(formData.edad_publico);
    if (!Number.isInteger(edad) || edad < 4 || edad > 18) {
      newErrors.edad_publico = "Edad debe ser un entero entre 4 y 18";
    }
    
    if (formData.duracion) {
      const duracion = Number(formData.duracion);
      if (!Number.isInteger(duracion) || duracion <= 0) {
        newErrors.duracion = "Duración debe ser un entero positivo";
      }
    }
    
    // Validaciones de archivos
    if (pdfFile) {
      const isPdf = pdfFile.type === "application/pdf";
      const sizeOk = pdfFile.size <= 10 * 1024 * 1024;
      if (!isPdf) newErrors.pdfFile = "Debe ser un PDF";
      if (!sizeOk) newErrors.pdfFile = "PDF máximo 10MB";
    }
    
    if (imageFile) {
      const isImg = ["image/jpeg", "image/png"].includes(imageFile.type);
      const sizeOk = imageFile.size <= 10 * 1024 * 1024;
      if (!isImg) newErrors.imageFile = "Imagen JPG o PNG";
      if (!sizeOk) newErrors.imageFile = "Imagen máximo 10MB";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // 1) Actualizar datos básicos
      await editarCuento({
        id: cuentoId,
        titulo: formData.titulo.trim(),
        edad_publico: Number(formData.edad_publico),
        autor_id_autor: Number(formData.autor_id_autor),
        genero_id_genero: Number(formData.genero_id_genero),
        duracion: formData.duracion ? Number(formData.duracion) : undefined,
      });

      // 2) Subir PDF si se seleccionó uno nuevo
      if (pdfFile) {
        await subirPDFCuentoV2({ cuentoId, file: pdfFile });
      }

      // 3) Subir imagen si se seleccionó una nueva
      if (imageFile) {
        await subirImagenCuento({ cuentoId, file: imageFile });
      }

      onUpdated?.();
      onClose?.();
    } catch (e) {
      setErrors({ submit: e.message || "Error actualizando cuento" });
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container edit-modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Cuento</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {loading && !cuento && <div>Cargando datos del cuento...</div>}
          
          {cuento && (
            <div className="edit-form-grid">
              {/* Datos básicos */}
              <div className="form-section">
                <h3 className="section-title">Datos básicos</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Título *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.titulo ? "error" : ""}`}
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Título del cuento"
                    />
                    {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Edad del público * (4-18)</label>
                    <input
                      type="number"
                      className={`form-input ${errors.edad_publico ? "error" : ""}`}
                      value={formData.edad_publico}
                      onChange={(e) => setFormData({ ...formData, edad_publico: e.target.value })}
                      placeholder="4-18"
                      min="4"
                      max="18"
                    />
                    {errors.edad_publico && <span className="error-message">{errors.edad_publico}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Autor *</label>
                    <select
                      className={`form-input ${errors.autor_id_autor ? "error" : ""}`}
                      value={formData.autor_id_autor}
                      onChange={(e) => setFormData({ ...formData, autor_id_autor: e.target.value })}
                    >
                      <option value="">Seleccionar autor</option>
                      {autores.map((a) => (
                        <option key={a.id_autor} value={a.id_autor}>
                          {a.nombre} {a.apellido}
                        </option>
                      ))}
                    </select>
                    {errors.autor_id_autor && <span className="error-message">{errors.autor_id_autor}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Género *</label>
                    <select
                      className={`form-input ${errors.genero_id_genero ? "error" : ""}`}
                      value={formData.genero_id_genero}
                      onChange={(e) => setFormData({ ...formData, genero_id_genero: e.target.value })}
                    >
                      <option value="">Seleccionar género</option>
                      {generos.map((g) => (
                        <option key={g.id_genero} value={g.id_genero}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.genero_id_genero && <span className="error-message">{errors.genero_id_genero}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Duración (minutos)</label>
                    <input
                      type="number"
                      className={`form-input ${errors.duracion ? "error" : ""}`}
                      value={formData.duracion}
                      onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                      placeholder="Ej: 15"
                      min="1"
                    />
                    {errors.duracion && <span className="error-message">{errors.duracion}</span>}
                  </div>
                </div>
              </div>

              {/* Archivos actuales */}
              <div className="form-section">
                <h3 className="section-title">Archivos actuales</h3>
                
                <div className="current-files">
                  {cuento.url_img && (
                    <div className="file-item">
                      <div className="file-preview">
                        <img src={cuento.url_img} alt="Portada actual" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
                      </div>
                      <div className="file-info">
                        <div className="file-name">Imagen de portada</div>
                      </div>
                    </div>
                  )}

                  {cuento.pdf_url && (
                    <div className="file-item">
                      <div className="file-preview">
                        <div style={{ width: 80, height: 80, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                          PDF
                        </div>
                      </div>
                      <div className="file-info">
                        <div className="file-name">Archivo PDF</div>
                        <div className="file-actions">
                          <a href={cuento.pdf_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                            <FaEye /> Ver
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {!cuento.url_img && !cuento.pdf_url && (
                    <div className="no-files">No hay archivos asociados</div>
                  )}
                </div>
              </div>

              {/* Subir nuevos archivos */}
              <div className="form-section">
                <h3 className="section-title">Cambiar archivos</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nuevo PDF (máx 10MB, .pdf)</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      className={`form-input ${errors.pdfFile ? "error" : ""}`}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                    {errors.pdfFile && <span className="error-message">{errors.pdfFile}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nueva imagen (máx 10MB, .jpg/.png)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      className={`form-input ${errors.imageFile ? "error" : ""}`}
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {errors.imageFile && <span className="error-message">{errors.imageFile}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.submit && <div className="error-banner">{errors.submit}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-submit" onClick={handleSubmit} disabled={loading || !cuento}>
            <FaSave /> {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
