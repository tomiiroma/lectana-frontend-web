import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Home from "./pages/Home.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

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
    ],
  },

  { path: "*", loader: () => redirect("/") },


]);


