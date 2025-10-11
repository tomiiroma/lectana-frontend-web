import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ 
        padding: 24,
        background: "var(--bg-primary)",
        minHeight: "100vh"
      }}>

 <Toaster
          position="top-center"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#477063ff',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />

        <Outlet />
      </main>
    </div>
  );
}


