import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Home from "./pages/Home.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import Cuentos from "./pages/admin/Cuentos.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";
import Aulas from "./pages/admin/Aulas.jsx";
import Actividades from "./pages/admin/Actividades.jsx";
import Perfil from "./pages/admin/Perfil.jsx";

function withProviders(element) {
  return <AuthProvider>{element}</AuthProvider>;
}

export const router = createBrowserRouter([

  {
    path: "/",
    element: withProviders(<Home />),
  },

  {
    path: "/admin",
    element: withProviders(<AdminLayout />),
    children: [
      { path: "login", element: <AdminLogin /> },
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


