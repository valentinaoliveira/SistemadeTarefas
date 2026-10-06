import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

function carregarUsuarioSalvo() {
  try {
    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
}

function converterRole(role) {
  if (
    role === 2 ||
    role === "Admin"
  ) {
    return "Admin";
  }

  return "User";
}

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(carregarUsuarioSalvo);

  const [token, setToken] =
    useState(() => {
      return localStorage.getItem(
        "token"
      );
    });

  async function login(email, senha) {
    const response =
      await api.post(
        "/Auth/login",
        {
          email,
          senha,
        }
      );

    const data = response.data;

    const loggedUser = {
      id: data.usuarioId,
      nome: data.nome,
      email: data.email,
      role: converterRole(
        data.role
      ),
    };

    setUser(loggedUser);
    setToken(data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedUser)
    );

    localStorage.setItem(
      "token",
      data.token
    );

    return loggedUser;
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const atualizarUsuarioAtual =
    useCallback(async () => {
      if (!token || !user?.id) {
        return null;
      }

      try {
        const response =
          await api.get(
            `/Usuarios/${user.id}`
          );

        const data =
          response.data;

        const usuarioAtualizado = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          role: converterRole(
            data.role
          ),
        };

        setUser(
          usuarioAtualizado
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            usuarioAtualizado
          )
        );

        return usuarioAtualizado;
      } catch (error) {
        if (
          error.response?.status !==
          401
        ) {
          console.error(
            "Erro ao atualizar usuário:",
            error
          );
        }

        throw error;
      }
    }, [
      token,
      user?.id,
    ]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        atualizarUsuarioAtual,

        isAuthenticated:
          !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}