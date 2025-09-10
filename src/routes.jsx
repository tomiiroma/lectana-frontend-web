import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import RequireAuth from "./auth/RequireAuth.jsx";
import Home from "./pages/Home.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminLogin from "./pages/admin/auth/Login.jsx";
import AdminDashboard from "./pages/admin/dashboard/Dashboard.jsx";
import Cuentos from "./pages/admin/cuentos/Cuentos.jsx";
import Usuarios from "./pages/admin/usuarios/Usuarios.jsx";
import Aulas from "./pages/admin/aulas/Aulas.jsx";
import Actividades from "./pages/admin/actividades/Actividades.jsx";
import Perfil from "./pages/admin/perfil/Perfil.jsx";

function withProviders(element) {
  return <AuthProvider>{element}</AuthProvider>;
}

export const router = createBrowserRouter([

  {
    path: "/",
    element: withProviders(<Home />),
  },

  // Ruta de login fuera del layout admin para no mostrar sidebar
  {
    path: "/admin/login",
    element: withProviders(<AdminLogin />),
  },

  {
    path: "/admin",
    element: withProviders(<AdminLayout />),
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "cuentos",
        element: (
          <RequireAuth>
            <Cuentos />
          </RequireAuth>
        ),
      },
      {
        path: "usuarios",
        element: (
          <RequireAuth>
            <Usuarios />
          </RequireAuth>
        ),
      },
      {
        path: "aulas",
        element: (
          <RequireAuth>
            <Aulas />
          </RequireAuth>
        ),
      },
      {
        path: "actividades",
        element: (
          <RequireAuth>
            <Actividades />
          </RequireAuth>
        ),
      },
      {
        path: "perfil",
        element: (
          <RequireAuth>
            <Perfil />
          </RequireAuth>
        ),
      },
    ],
  },

  { path: "*", loader: () => redirect("/") },


]);


