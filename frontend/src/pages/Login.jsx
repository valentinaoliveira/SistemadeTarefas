import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  ListTodo,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";

import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [erro, setErro] = useState("");

  const [carregando, setCarregando] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      await login(email, senha);

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error
      );

      if (error.response?.status === 401) {
        setErro(
          "E-mail ou senha incorretos."
        );
      } else {
        setErro(
          "Não foi possível conectar ao servidor."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <button
        className="theme-button"
        onClick={toggleTheme}
        type="button"
        aria-label="Alterar tema"
      >
        {theme === "light" ? (
          <Moon size={20} />
        ) : (
          <Sun size={20} />
        )}
      </button>

      <motion.section
        className="login-card"
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <div className="login-logo">
          <ListTodo size={32} />
        </div>

        <div className="login-header">
          <h1>Sistema de Tarefas</h1>

          <p>
            Entre na sua conta para continuar
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={carregando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              Senha
            </label>

            <div className="password-field">
              <input
                id="senha"
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) =>
                  setSenha(
                    event.target.value
                  )
                }
                disabled={carregando}
                required
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setMostrarSenha(
                    (value) => !value
                  )
                }
                disabled={carregando}
                aria-label={
                  mostrarSenha
                    ? "Ocultar senha"
                    : "Mostrar senha"
                }
              >
                {mostrarSenha ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {erro && (
            <div className="login-error">
              {erro}
            </div>
          )}

          <motion.button
            className="login-button"
            type="submit"
            disabled={carregando}
            whileHover={
              carregando
                ? {}
                : {
                    scale: 1.02,
                  }
            }
            whileTap={
              carregando
                ? {}
                : {
                    scale: 0.98,
                  }
            }
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}
          </motion.button>
        </form>

        <p className="login-footer">
          Organize suas tarefas de forma
          simples e eficiente.
        </p>
      </motion.section>
    </main>
  );
}

export default Login;