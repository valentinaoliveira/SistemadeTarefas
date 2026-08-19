import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  Users,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ListTodo size={25} />
        </div>

        <span>Sistema de Tarefas</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <LayoutDashboard size={20} />

          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/tarefas"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <ListTodo size={20} />

          <span>Tarefas</span>
        </NavLink>

        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            isActive
              ? "sidebar-link active"
              : "sidebar-link"
          }
        >
          <Users size={20} />

          <span>Usuários</span>
        </NavLink>
      </nav>

      <button
        className="logout-button"
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={20} />

        <span>Sair</span>
      </button>
    </aside>
  );
}

export default Sidebar;