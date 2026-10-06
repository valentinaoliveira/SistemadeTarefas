import {
  Navigate,
  Outlet,
} from "react-router";

import { useAuth } from "../contexts/AuthContext";

function AdminRoute() {
  const { user, isAuthenticated } =
    useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (user?.role !== "Admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;