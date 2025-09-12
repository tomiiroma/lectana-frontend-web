import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

export default function AdminLayout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ 
        padding: 24,
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f4ff 100%)",
        minHeight: "100vh"
      }}>
        <Outlet />
      </main>
    </div>
  );
}


