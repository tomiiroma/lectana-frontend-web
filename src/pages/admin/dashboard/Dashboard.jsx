import "./Dashboard.css"
import "../AdminPages.css"
import CardCounter from "../../../components/Cards/CardCounter/CardCounter"
import { FaBookOpen, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import CardDashboard from "../../../components/Cards/CardDashboard/CardDashboard";
import TableExample from "../../../components/Tables/TableExample";
import { useState, useEffect } from "react";
import { obtenerTotalCuentos } from "../../../api/cuentos";
import { obtenerEstadisticasUsuarios } from "../../../api/administradores";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCuentos: 0,
    totalDocentes: 0,
    totalEstudiantes: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true }));
        
        // Obtener estadísticas en paralelo
        const [cuentosData, usuariosData] = await Promise.all([
          obtenerTotalCuentos(),
          obtenerEstadisticasUsuarios()
        ]);

        setStats({
          totalCuentos: cuentosData || 0,
          totalDocentes: usuariosData?.total_docentes || 0,
          totalEstudiantes: usuariosData?.total_alumnos || 0,
          loading: false
        });

        console.log("📊 Estadísticas del dashboard cargadas:", {
          cuentos: cuentosData,
          docentes: usuariosData?.total_docentes,
          estudiantes: usuariosData?.total_alumnos
        });
      } catch (error) {
        console.error("❌ Error cargando estadísticas del dashboard:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <>
    <h1 className="dashboardPrincipal-title">🚀 Dashboard Principal</h1>
    <div className="dashboardCardCounter-container">
      <CardCounter 
        title={"Total Cuentos"} 
        data={stats.loading ? "..." : stats.totalCuentos.toString()} 
        Icon={FaBookOpen}
      />
      <CardCounter 
        title={"Total Docentes"} 
        data={stats.loading ? "..." : stats.totalDocentes.toString()} 
        Icon={FaChalkboardTeacher}
      />
      <CardCounter 
        title={"Total Estudiantes"} 
        data={stats.loading ? "..." : stats.totalEstudiantes.toString()} 
        Icon={FaUserGraduate}
      />
      <CardCounter title={"Total Aulas"} data={"520"} Icon={FaBookOpen}/>
    </div>

    <div className="dashboardCards-container">
      <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>
            <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>
      <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>

    </div>
    </>
  )
}


