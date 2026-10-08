import {
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function MeuPerfil() {
  const {
    user,
    atualizarUsuarioAtual,
  } = useAuth();

  const [dados, setDados] =
    useState({
      nome: "",
      email: "",
    });

  const [senhas, setSenhas] =
    useState({
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });

  const [
    salvandoDados,
    setSalvandoDados,
  ] = useState(false);

  const [
    salvandoSenha,
    setSalvandoSenha,
  ] = useState(false);

  const [
    mostrarSenhaAtual,
    setMostrarSenhaAtual,
  ] = useState(false);

  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] = useState(false);

  const [
    mostrarConfirmacao,
    setMostrarConfirmacao,
  ] = useState(false);

  const [
    mensagemDados,
    setMensagemDados,
  ] = useState("");

  const [
    erroDados,
    setErroDados,
  ] = useState("");

  const [
    mensagemSenha,
    setMensagemSenha,
  ] = useState("");

  const [
    erroSenha,
    setErroSenha,
  ] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setDados({
      nome: user.nome || "",
      email: user.email || "",
    });
  }, [
    user?.id,
    user?.nome,
    user?.email,
  ]);

  function handleDadosChange(event) {
    const {
      name,
      value,
    } = event.target;

    setDados((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSenhaChange(event) {
    const {
      name,
      value,
    } = event.target;

    setSenhas((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function salvarDados(event) {
    event.preventDefault();

    setErroDados("");
    setMensagemDados("");

    const nome =
      dados.nome.trim();

    const email =
      dados.email.trim();

    if (!nome) {
      setErroDados(
        "Informe o seu nome."
      );

      return;
    }

    if (!email) {
      setErroDados(
        "Informe o seu e-mail."
      );

      return;
    }

    setSalvandoDados(true);

    try {
      await api.put(
        `/Usuarios/${user.id}`,
        {
          nome,
          email,
        }
      );

      await atualizarUsuarioAtual();

      setMensagemDados(
        "Informações atualizadas com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar perfil:",
        error
      );

      if (
        error.response?.status !== 401
      ) {
        setErroDados(
          error.response?.data
            ?.mensagem ||
            "Não foi possível atualizar suas informações."
        );
      }
    } finally {
      setSalvandoDados(false);
    }
  }

  async function alterarSenha(event) {
    event.preventDefault();

    setErroSenha("");
    setMensagemSenha("");

    if (
      !senhas.senhaAtual ||
      !senhas.novaSenha ||
      !senhas.confirmarNovaSenha
    ) {
      setErroSenha(
        "Preencha todos os campos de senha."
      );

      return;
    }

    if (
      senhas.novaSenha.length < 6
    ) {
      setErroSenha(
        "A nova senha deve possuir pelo menos 6 caracteres."
      );

      return;
    }

    if (
      senhas.novaSenha !==
      senhas.confirmarNovaSenha
    ) {
      setErroSenha(
        "A nova senha e a confirmação não são iguais."
      );

      return;
    }

    setSalvandoSenha(true);

    try {
      await api.patch(
        "/Usuarios/me/senha",
        {
          senhaAtual:
            senhas.senhaAtual,

          novaSenha:
            senhas.novaSenha,

          confirmarNovaSenha:
            senhas.confirmarNovaSenha,
        }
      );

      setSenhas({
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });

      setMostrarSenhaAtual(false);
      setMostrarNovaSenha(false);
      setMostrarConfirmacao(false);

      setMensagemSenha(
        "Senha alterada com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao alterar senha:",
        error
      );

      if (
        error.response?.status !== 401
      ) {
        setErroSenha(
          error.response?.data
            ?.mensagem ||
            "Não foi possível alterar a senha."
        );
      }
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="page-title">
        <h1>
          Meu Perfil
        </h1>

        <p>
          Gerencie suas informações
          pessoais e a segurança da
          sua conta.
        </p>
      </div>

      <section className="profile-summary">
        <div className="profile-avatar">
          <User size={30} />
        </div>

        <div className="profile-summary-info">
          <h2>
            {user?.nome}
          </h2>

          <div className="profile-summary-email">
            <Mail size={16} />

            <span>
              {user?.email}
            </span>
          </div>
        </div>

        <div
          className={`profile-role ${
            user?.role === "Admin"
              ? "admin"
              : "user"
          }`}
        >
          <ShieldCheck size={16} />

          {user?.role === "Admin"
            ? "Administrador"
            : "Usuário"}
        </div>
      </section>

      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <User size={21} />
            </div>

            <div>
              <h2>
                Informações pessoais
              </h2>

              <p>
                Atualize seu nome e
                endereço de e-mail.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={salvarDados}
          >
            <div className="form-group">
              <label htmlFor="profile-nome">
                Nome
              </label>

              <input
                id="profile-nome"
                name="nome"
                type="text"
                value={dados.nome}
                onChange={
                  handleDadosChange
                }
                disabled={
                  salvandoDados
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">
                E-mail
              </label>

              <input
                id="profile-email"
                name="email"
                type="email"
                value={dados.email}
                onChange={
                  handleDadosChange
                }
                disabled={
                  salvandoDados
                }
                required
              />
            </div>

            {erroDados && (
              <div className="profile-message error">
                {erroDados}
              </div>
            )}

            {mensagemDados && (
              <div className="profile-message success">
                <CheckCircle2
                  size={17}
                />

                {mensagemDados}
              </div>
            )}

            <div className="profile-form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={
                  salvandoDados
                }
              >
                <Save size={18} />

                {salvandoDados
                  ? "Salvando..."
                  : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>

        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-card-icon">
              <KeyRound size={21} />
            </div>

            <div>
              <h2>
                Segurança
              </h2>

              <p>
                Altere a senha de
                acesso à sua conta.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={alterarSenha}
          >
            <div className="form-group">
              <label htmlFor="senhaAtual">
                Senha atual
              </label>

              <div className="password-field">
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type={
                    mostrarSenhaAtual
                      ? "text"
                      : "password"
                  }
                  value={
                    senhas.senhaAtual
                  }
                  onChange={
                    handleSenhaChange
                  }
                  disabled={
                    salvandoSenha
                  }
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarSenhaAtual(
                      (current) =>
                        !current
                    )
                  }
                  tabIndex={-1}
                >
                  {mostrarSenhaAtual ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="novaSenha">
                Nova senha
              </label>

              <div className="password-field">
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type={
                    mostrarNovaSenha
                      ? "text"
                      : "password"
                  }
                  value={
                    senhas.novaSenha
                  }
                  onChange={
                    handleSenhaChange
                  }
                  disabled={
                    salvandoSenha
                  }
                  minLength={6}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarNovaSenha(
                      (current) =>
                        !current
                    )
                  }
                  tabIndex={-1}
                >
                  {mostrarNovaSenha ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>

              <small>
                Use pelo menos 6
                caracteres.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmarNovaSenha">
                Confirmar nova senha
              </label>

              <div className="password-field">
                <input
                  id="confirmarNovaSenha"
                  name="confirmarNovaSenha"
                  type={
                    mostrarConfirmacao
                      ? "text"
                      : "password"
                  }
                  value={
                    senhas.confirmarNovaSenha
                  }
                  onChange={
                    handleSenhaChange
                  }
                  disabled={
                    salvandoSenha
                  }
                  minLength={6}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarConfirmacao(
                      (current) =>
                        !current
                    )
                  }
                  tabIndex={-1}
                >
                  {mostrarConfirmacao ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </div>

            {erroSenha && (
              <div className="profile-message error">
                {erroSenha}
              </div>
            )}

            {mensagemSenha && (
              <div className="profile-message success">
                <CheckCircle2
                  size={17}
                />

                {mensagemSenha}
              </div>
            )}

            <div className="profile-form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={
                  salvandoSenha
                }
              >
                <KeyRound
                  size={18}
                />

                {salvandoSenha
                  ? "Alterando..."
                  : "Alterar senha"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default MeuPerfil;