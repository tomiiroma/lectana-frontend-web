import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaBook, FaCheck, FaPlus, FaSave, FaUser, FaTags } from "react-icons/fa";
import "./CreateStoryWizard.css";
import { listarAutores, crearAutor } from "../../../api/autores";
import { listarGeneros, crearGenero } from "../../../api/generos";
import { crearCuentoPlano, subirPDFCuentoV2, subirImagenCuento, obtenerCuentoPorId } from "../../../api/cuentos";

const initialStory = {
  titulo: "",
  edad_publico: "",
  autor_id_autor: "",
  genero_id_genero: "",
};

export default function CreateStoryWizard({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [creatingAutor, setCreatingAutor] = useState(false);
  const [creatingGenero, setCreatingGenero] = useState(false);

  const [newAutor, setNewAutor] = useState({ nombre: "", apellido: "" });
  const [newGenero, setNewGenero] = useState({ nombre: "" });

  const [story, setStory] = useState(initialStory);
  const [cuentoId, setCuentoId] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const [a, g] = await Promise.all([listarAutores(), listarGeneros()]);
        setAutores(a || []);
        setGeneros(g || []);
      } catch (e) {
        // no-op visual por ahora; se puede agregar toast
      }
    })();
  }, [isOpen]);

  const canGoNext = useMemo(() => {
    if (step === 1) return Boolean(story.autor_id_autor);
    if (step === 2) return Boolean(story.genero_id_genero);
    if (step === 3) return true; // validamos al hacer click
    if (step === 4) return true;
    return false;
  }, [step, story]);

  const validatePlainStory = () => {
    const newErrors = {};
    
    // Validar título
    if (!story.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    } else if (story.titulo.trim().length < 1) {
      newErrors.titulo = "El título debe tener al menos 1 carácter";
    }
    
    // Validar autor
    if (!story.autor_id_autor) {
      newErrors.autor_id_autor = "Autor requerido";
    }
    
    // Validar género
    if (!story.genero_id_genero) {
      newErrors.genero_id_genero = "Género requerido";
    }
    
    // Validar edad
    const n = Number(story.edad_publico);
    if (!Number.isInteger(n) || n < 4 || n > 18) {
      newErrors.edad_publico = "Edad debe ser un entero entre 4 y 18";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAutor = async () => {
    if (!newAutor.nombre.trim() || !newAutor.apellido.trim()) return;
    setLoading(true);
    try {
      const created = await crearAutor({ nombre: newAutor.nombre.trim(), apellido: newAutor.apellido.trim() });
      setAutores((prev) => [created, ...prev]);
      setStory((s) => ({ ...s, autor_id_autor: created.id_autor }));
      setCreatingAutor(false);
      setNewAutor({ nombre: "", apellido: "" });
    } catch (e) {
      // manejar error UI si hace falta
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGenero = async () => {
    if (!newGenero.nombre.trim()) return;
    setLoading(true);
    try {
      const created = await crearGenero({ nombre: newGenero.nombre.trim() });
      setGeneros((prev) => [created, ...prev]);
      setStory((s) => ({ ...s, genero_id_genero: created.id_genero }));
      setCreatingGenero(false);
      setNewGenero({ nombre: "" });
    } catch (e) {
      // manejar error UI si hace falta
    } finally {
      setLoading(false);
    }
  };

  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleCreatePlainStory = async () => {
    console.log("Click: Crear cuento (paso 3)", { story });
    if (!validatePlainStory()) {
      console.warn("Validación fallida en paso 3", { story });
      setErrors((prev) => ({ ...prev, submit: "Revisa los campos marcados" }));
      return;
    }
    setLoading(true);
    try {
      const payload = {
        titulo: story.titulo.trim(),
        edad_publico: Number(story.edad_publico),
        autor_id_autor: story.autor_id_autor,
        genero_id_genero: story.genero_id_genero,
      };
      console.log("Creando cuento con payload:", payload);
      const created = await crearCuentoPlano(payload);
      const newId = created.id_cuento || created.id || created.uuid || null;
      setCuentoId(newId);
      setStep(4);
      setErrors({});
    } catch (e) {
      console.error("Error creando cuento:", e);
      const detalles = e?.response?.data?.detalles;
      const fieldErrors = detalles?.fieldErrors || detalles; // compat: puede venir directo o dentro de fieldErrors
      if (fieldErrors && typeof fieldErrors === "object") {
        const mapped = { submit: e?.response?.data?.error || "Validación fallida" };
        if (fieldErrors.titulo) mapped.titulo = fieldErrors.titulo;
        if (fieldErrors.edad_publico) mapped.edad_publico = fieldErrors.edad_publico;
        if (fieldErrors.autor_id_autor) mapped.autor_id_autor = fieldErrors.autor_id_autor;
        if (fieldErrors.genero_id_genero) mapped.genero_id_genero = fieldErrors.genero_id_genero;
        setErrors(mapped);
      } else {
        setErrors({ submit: e.message || "Error creando cuento" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFinishUploads = async () => {
    // Validaciones de archivos opcionales
    const newErrors = {};
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
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      if (cuentoId && pdfFile) {
        await subirPDFCuentoV2({ cuentoId, file: pdfFile });
      }
      if (cuentoId && imageFile) {
        await subirImagenCuento({ cuentoId, file: imageFile });
      }
      let finalData = null;
      if (cuentoId) {
        try { finalData = await obtenerCuentoPorId(cuentoId); } catch (_) {}
      }
      onCreated?.(finalData || { id_cuento: cuentoId });
      onClose?.();
      setStep(1);
      setStory(initialStory);
      setPdfFile(null);
      setImageFile(null);
      setCuentoId(null);
      setErrors({});
    } catch (e) {
      setErrors({ submit: e.message || "Error subiendo archivos" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Nuevo Cuento</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="wizard-steps">
          <div className={`wizard-step ${step === 1 ? "active" : ""}`}>
            <span className="wizard-icon"><FaUser /></span>
            <span>Autor</span>
          </div>
          <div className={`wizard-step ${step === 2 ? "active" : ""}`}>
            <span className="wizard-icon"><FaTags /></span>
            <span>Género</span>
          </div>
          <div className={`wizard-step ${step === 3 ? "active" : ""}`}>
            <span className="wizard-icon"><FaBook /></span>
            <span>Cuento</span>
          </div>
          <div className={`wizard-step ${step === 4 ? "active" : ""}`}>
            <span className="wizard-icon"><FaSave /></span>
            <span>Archivos</span>
          </div>
        </div>

        {step === 1 && (
          <div className="wizard-content">
            <h3 className="section-title">Elegir o crear autor</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Autor existente</label>
                <select
                  className="form-input"
                  value={story.autor_id_autor}
                  onChange={(e) => setStory({ ...story, autor_id_autor: e.target.value })}
                >
                  <option value="">Seleccionar autor</option>
                  {autores.map((a) => (
                    <option key={a.id_autor} value={a.id_autor}>
                      {a.nombre} {a.apellido}
                    </option>
                  ))}
                </select>
                {story.autor_id_autor && (
                  <span className="helper-text">
                    ID seleccionado: {story.autor_id_autor}
                  </span>
                )}
                {errors.autor_id_autor && <span className="error-message">{errors.autor_id_autor}</span>}
              </div>
              <div className="form-group">
                {!creatingAutor ? (
                  <button className="btn-secondary" onClick={() => setCreatingAutor(true)}>
                    <FaPlus /> Crear autor
                  </button>
                ) : (
                  <div className="inline-form">
                    <div className="inline-form-row">
                      <input
                        type="text"
                        placeholder="Nombre"
                        className="form-input"
                        value={newAutor.nombre}
                        onChange={(e) => setNewAutor({ ...newAutor, nombre: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Apellido"
                        className="form-input"
                        value={newAutor.apellido}
                        onChange={(e) => setNewAutor({ ...newAutor, apellido: e.target.value })}
                      />
                    </div>
                    <div className="inline-form-buttons">
                      <button className="btn-submit" onClick={handleCreateAutor} disabled={loading}>
                        <FaCheck /> {loading ? "Creando..." : "Guardar"}
                      </button>
                      <button className="btn-cancel" onClick={() => setCreatingAutor(false)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-content">
            <h3 className="section-title">Elegir o crear género</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Género existente</label>
                <select
                  className="form-input"
                  value={story.genero_id_genero}
                  onChange={(e) => setStory({ ...story, genero_id_genero: e.target.value })}
                >
                  <option value="">Seleccionar género</option>
                  {generos.map((g) => (
                    <option key={g.id_genero} value={g.id_genero}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {story.genero_id_genero && (
                  <span className="helper-text">
                    ID seleccionado: {story.genero_id_genero}
                  </span>
                )}
                {errors.genero_id_genero && <span className="error-message">{errors.genero_id_genero}</span>}
              </div>
              <div className="form-group">
                {!creatingGenero ? (
                  <button className="btn-secondary" onClick={() => setCreatingGenero(true)}>
                    <FaPlus /> Crear género
                  </button>
                ) : (
                  <div className="inline-form-single">
                    <input
                      type="text"
                      placeholder="Nombre del género"
                      className="form-input"
                      value={newGenero.nombre}
                      onChange={(e) => setNewGenero({ ...newGenero, nombre: e.target.value })}
                    />
                    <div className="inline-form-buttons">
                      <button className="btn-submit" onClick={handleCreateGenero} disabled={loading}>
                        <FaCheck /> {loading ? "Creando..." : "Guardar"}
                      </button>
                      <button className="btn-cancel" onClick={() => setCreatingGenero(false)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-content">
            <h3 className="section-title">Datos del cuento</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input
                  type="text"
                  className={`form-input ${errors.titulo ? "error" : ""}`}
                  value={story.titulo}
                  onChange={(e) => setStory({ ...story, titulo: e.target.value })}
                  placeholder="Título del cuento"
                />
                {errors.titulo && <span className="error-message">{errors.titulo}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Edad del público * (4-18)</label>
                <input
                  type="number"
                  className={`form-input ${errors.edad_publico ? "error" : ""}`}
                  value={story.edad_publico}
                  onChange={(e) => setStory({ ...story, edad_publico: e.target.value })}
                  placeholder="4-18"
                  min="4"
                  max="18"
                />
                {errors.edad_publico && <span className="error-message">{errors.edad_publico}</span>}
              </div>
            </div>
            {errors.submit && <div className="error-banner">{errors.submit}</div>}
          </div>
        )}

        {step === 4 && (
          <div className="wizard-content">
            <h3 className="section-title">Subir PDF e Imagen (opcional)</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">PDF (máx 10MB, .pdf)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  className={`form-input ${errors.pdfFile ? "error" : ""}`}
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                />
                {errors.pdfFile && <span className="error-message">{errors.pdfFile}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Imagen de portada (máx 10MB, .jpg/.png)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className={`form-input ${errors.imageFile ? "error" : ""}`}
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {errors.imageFile && <span className="error-message">{errors.imageFile}</span>}
              </div>
            </div>
            {errors.submit && <div className="error-banner">{errors.submit}</div>}
          </div>
        )}

        <div className="modal-footer">
          {step > 1 ? (
            <button className="btn-cancel" onClick={() => setStep(step - 1)}>
              <FaArrowLeft /> Volver
            </button>
          ) : (
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          )}

          {step < 3 && (
            <button className="btn-submit" onClick={() => canGoNext && setStep(step + 1)} disabled={!canGoNext}>
              Siguiente
            </button>
          )}
          {step === 3 && (
            <button type="button" className="btn-submit" onClick={handleCreatePlainStory} disabled={loading}>
              <FaSave /> {loading ? "Creando..." : "Crear cuento"}
            </button>
          )}
          {step === 4 && (
            <button className="btn-submit" onClick={handleFinishUploads} disabled={loading}>
              {loading ? "Guardando..." : "Finalizar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


