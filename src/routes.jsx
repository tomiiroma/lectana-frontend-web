import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import RequireAuth from "./auth/RequireAuth.jsx"; // REACTIVADO - Protección de rutas admin
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/dashboard/Dashboard.jsx";
import Cuentos from "./pages/admin/cuentos/Cuentos.jsx";
import CuentoDetalle from "./pages/admin/cuentos/CuentoDetalle.jsx";
import Usuarios from "./pages/admin/usuarios/Usuarios.jsx";
import Aulas from "./pages/admin/aulas/Aulas.jsx";
import Actividades from "./pages/admin/actividades/Actividades.jsx";
import Logros from "./pages/admin/logros/Logros.jsx";
import Perfil from "./pages/admin/perfil/PerfilSimplificado.jsx";
import DescargaApp from "./pages/DescargaApp/DescargaApp.jsx";
import Catalogo from "./pages/Catalogo/Catalogo.jsx";

function withProviders(element) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {element}
      </AuthProvider>
    </ThemeProvider>
  );
}

export const router = createBrowserRouter([

  {
    path: "/",
    element: withProviders(<Home />),
  },

  // Ruta de login general
  {
    path: "/login",
    element: withProviders(<Login />),
  },

  // Ruta de descarga de la app
  {
    path: "/descarga-app",
    element: withProviders(<DescargaApp />),
  },

  // Ruta de catálogo de cuentos
  {
    path: "/catalogo",
    element: withProviders(<Catalogo />),
  },

  {
    path: "/admin",
    element: withProviders(
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "cuentos",
        element: <Cuentos />,
      },
      {
        path: "cuentos/:id",
        element: <CuentoDetalle />,
      },
      {
        path: "usuarios",
        element: <Usuarios />,
      },
      {
        path: "aulas",
        element: <Aulas />,
      },
      {
        path: "actividades",
        element: <Actividades />,
      },
       {
        path: "logros", 
        element: <Logros />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
    ],
  },

  { path: "*", loader: () => redirect("/") },


]);


