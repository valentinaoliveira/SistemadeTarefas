import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import Layout from "../components/layout/Layout";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Tarefas from "../pages/Tarefas";
import Usuarios from "../pages/Usuarios";
import MeuPerfil from "../pages/MeuPerfil";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/tarefas"
            element={<Tarefas />}
          />

          <Route
            path="/perfil"
            element={<MeuPerfil />}
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/usuarios"
              element={<Usuarios />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="/login"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;