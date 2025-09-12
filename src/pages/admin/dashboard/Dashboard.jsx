import "./Dashboard.css"
import "../AdminPages.css"
import CardCounter from "../../../components/Cards/CardCounter/CardCounter"
import { FaBookOpen } from "react-icons/fa";
import CardDashboard from "../../../components/Cards/CardDashboard/CardDashboard";
import TableExample from "../../../components/Tables/TableExample";

export default function Dashboard() {
  return (
    <>
    <h1 className="dashboardPrincipal-title">🚀 Dashboard Principal</h1>
    <div className="dashboardCardCounter-container">
      <CardCounter title={"Total Cuentos"} data={"520"} Icon={FaBookOpen}/>
            <CardCounter title={"Total Cuentos"} data={"520"} Icon={FaBookOpen}/>
      <CardCounter title={"Total Cuentos"} data={"520"} Icon={FaBookOpen}/>
      <CardCounter title={"Total Cuentos"} data={"520"} Icon={FaBookOpen}/>
    </div>

    <div className="dashboardCards-container">
      <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>
            <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>
      <CardDashboard title={"Actividad Mensual"} action={"Ver mas"} content={<TableExample/>}/>

    </div>
    </>
  )
}


