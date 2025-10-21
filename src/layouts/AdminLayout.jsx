import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout() {
  return (
     <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      maxHeight: "100vh",  
      overflow: "hidden"    
    }}>
      <div style={{ 
        width: 240,
        height: "100vh",
        overflowY: "auto",  
        flexShrink: 0
      }}>
        <AdminSidebar />
      </div>
      
      <main style={{ 
        flex: 1,
        padding: 24,
        background: "var(--bg-primary)",
        height: "100vh",
        overflowY: "auto"    
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


