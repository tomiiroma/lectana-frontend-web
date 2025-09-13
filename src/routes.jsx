import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import RequireAuth from "./auth/RequireAuth.jsx"; // REACTIVADO - Protección de rutas admin
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/dashboard/Dashboard.jsx";
import Cuentos from "./pages/admin/cuentos/Cuentos.jsx";
import Usuarios from "./pages/admin/usuarios/Usuarios.jsx";
import Aulas from "./pages/admin/aulas/Aulas.jsx";
import Actividades from "./pages/admin/actividades/Actividades.jsx";
import Perfil from "./pages/admin/perfil/Perfil.jsx";

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
        path: "perfil",
        element: <Perfil />,
      },
    ],
  },

  { path: "*", loader: () => redirect("/") },


]);


