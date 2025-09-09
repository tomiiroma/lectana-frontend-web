import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}


