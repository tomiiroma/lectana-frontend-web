import AdminActionsBar from "../../../components/AdminActionsBar/AdminActionsBar";
import "../AdminPages.css";
import { gradients } from "../../../styles/Gradients";
import "./Cuentos.css";
import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch, FaFilter, FaDownload } from "react-icons/fa";
import CardStats from "../../../components/Cards/CardData/CardStats";
import React, { useState } from "react";
import CreateStoryWizard from "../../../components/Modals/CreateStoryWizard/CreateStoryWizard";

export default function Cuentos() {
  const [openWizard, setOpenWizard] = useState(false);

  return (
    <>
      <h1 className="admin-page-title admin-cuentos-title">📚 Gestión de Cuentos</h1>
      

      <AdminActionsBar btnTitle={"Nuevo Cuento"} placeholderTitle={"Buscar cuentos..."} btnClassName="btnAdd" btnStyle={gradients.orangeGradient} onBtnClick={() => setOpenWizard(true)}/>
    
      <div className="admin-page-container admin-cuentos-container">
        {/* Estadísticas rápidas */}
        <div className="stats-grid">
          <CardStats number={"156"} label={"Total Cuentos"}/>
          <CardStats number={"89"} label={"Publicados"}/>
          <CardStats number={"4.8"} label={"Rating Promedio"}/>
        </div>

        {/* Tabla de cuentos */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoría</th>
                <th>Edad</th>
                <th>Estado</th>
                <th>Lecturas</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">El Dragón Valiente</div>
                      <div className="story-subtitle">Historia de aventuras</div>
                    </div>
                  </div>
                </td>
                <td>María González</td>
                <td><span className="category-tag cat-adventure">Aventura</span></td>
                <td>6-8 años</td>
                <td><span className="status-badge status-published">Publicado</span></td>
                <td>1,234</td>
                <td>15/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">La Princesa del Bosque</div>
                      <div className="story-subtitle">Cuento de fantasía</div>
                    </div>
                  </div>
                </td>
                <td>Carlos Mendez</td>
                <td><span className="category-tag cat-fantasy">Fantasía</span></td>
                <td>4-6 años</td>
                <td><span className="status-badge status-draft">Borrador</span></td>
                <td>0</td>
                <td>20/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="story-info">
                    <div className="story-cover"></div>
                    <div>
                      <div className="story-title">El Robot Amigable</div>
                      <div className="story-subtitle">Ciencia ficción para niños</div>
                    </div>
                  </div>
                </td>
                <td>Ana Ruiz</td>
                <td><span className="category-tag cat-scifi">Sci-Fi</span></td>
                <td>8-10 años</td>
                <td><span className="status-badge status-published">Publicado</span></td>
                <td>856</td>
                <td>10/08/2024</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" title="Ver">
                      <FaEye />
                    </button>
                    <button className="btn-action btn-edit" title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn-action btn-delete" title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando 1-10 de 156 cuentos
          </div>
          <div className="pagination-buttons">
            <button className="btn-pagination" disabled>Anterior</button>
            <button className="btn-pagination active">1</button>
            <button className="btn-pagination">2</button>
            <button className="btn-pagination">3</button>
            <button className="btn-pagination">...</button>
            <button className="btn-pagination">16</button>
            <button className="btn-pagination">Siguiente</button>
          </div>
        </div>
      </div>

      <CreateStoryWizard isOpen={openWizard} onClose={() => setOpenWizard(false)} onCreated={() => { /* TODO: refrescar lista cuando exista */ }}/>
    </>
  );
}


