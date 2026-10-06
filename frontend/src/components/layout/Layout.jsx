import { useEffect } from "react";
import { Outlet } from "react-router";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { useAuth } from "../../contexts/AuthContext";

function Layout() {
  const {
    isAuthenticated,
    atualizarUsuarioAtual,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function sincronizarPerfil() {
      try {
        await atualizarUsuarioAtual();
      } catch (error) {
        if (
          error.response?.status !== 401
        ) {
          console.error(
            "Erro ao sincronizar perfil:",
            error
          );
        }
      }
    }

    // Sincroniza quando o sistema é aberto.
    sincronizarPerfil();

    // Sincroniza quando o usuário volta
    // para esta aba do navegador.
    function handleFocus() {
      sincronizarPerfil();
    }

    // Também sincroniza quando a aba
    // volta a ficar visível.
    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        sincronizarPerfil();
      }
    }

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    isAuthenticated,
    atualizarUsuarioAtual,
  ]);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <Header />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;