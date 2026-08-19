import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  function login(loginResponse) {
    const loggedUser = {
      id: loginResponse.usuarioId,
      nome: loginResponse.nome,
      email: loginResponse.email,
      role: loginResponse.role,
    };

    setUser(loggedUser);
    setToken(loginResponse.token);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedUser)
    );

    localStorage.setItem(
      "token",
      loginResponse.token
    );
  }

  function logout() {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}