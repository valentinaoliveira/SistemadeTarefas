import {
  Moon,
  Sun,
  User,
} from "lucide-react";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

function Header() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  const { user } = useAuth();

  return (
    <header className="header">
      <div>
        <h2>
          Bem-vindo
          {user?.nome
            ? `, ${user.nome}!`
            : "!"}
        </h2>

        <p>
          Gerencie suas tarefas e acompanhe
          seu progresso.
        </p>
      </div>

      <div className="header-actions">
        <button
          className="header-theme-button"
          type="button"
          onClick={toggleTheme}
          aria-label="Alterar tema"
        >
          {theme === "light" ? (
            <Moon size={20} />
          ) : (
            <Sun size={20} />
          )}
        </button>

        <div
          className="user-avatar"
          title={
            user?.email ||
            "Usuário"
          }
        >
          <User size={20} />
        </div>
      </div>
    </header>
  );
}

export default Header;