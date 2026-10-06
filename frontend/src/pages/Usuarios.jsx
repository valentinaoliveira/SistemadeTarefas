import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const formInicial = {
  nome: "",
  email: "",
  senha: "",
  role: "User",
};

function converterRole(role) {
  if (
    role === 2 ||
    role === "Admin"
  ) {
    return "Admin";
  }

  return "User";
}

function Usuarios() {
  const {
    user,
    atualizarUsuarioAtual,
  } = useAuth();

  const [usuarios, setUsuarios] =
    useState([]);

  const [busca, setBusca] =
    useState("");

  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);

  const [
    usuarioEditando,
    setUsuarioEditando,
  ] = useState(null);

  const [form, setForm] =
    useState(formInicial);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  const [
    salvando,
    setSalvando,
  ] = useState(false);

  const [erro, setErro] =
    useState("");

  async function sincronizarUsuario() {
    try {
      await atualizarUsuarioAtual();
    } catch (error) {
      if (
        error.response?.status !== 401
      ) {
        console.error(
          "Erro ao sincronizar usuário:",
          error
        );
      }
    }
  }

  async function carregarUsuarios() {
    setCarregando(true);
    setErro("");

    try {
      const response =
        await api.get("/Usuarios");

      setUsuarios(
        response.data
      );
    } catch (error) {
      console.error(
        "Erro ao carregar usuários:",
        error
      );

      if (
        error.response?.status === 403
      ) {
        await sincronizarUsuario();

        setErro(
          "Seu perfil foi atualizado e você não possui mais permissão para acessar esta área."
        );
      } else if (
        error.response?.status !== 401
      ) {
        setErro(
          "Não foi possível carregar os usuários."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();

    // Executa quando a página é aberta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usuariosFiltrados =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase();

      return usuarios.filter(
        (usuario) => {
          const nome =
            usuario.nome
              ?.toLowerCase() ?? "";

          const email =
            usuario.email
              ?.toLowerCase() ?? "";

          return (
            nome.includes(termo) ||
            email.includes(termo)
          );
        }
      );
    }, [
      usuarios,
      busca,
    ]);

  function abrirNovoUsuario() {
    setUsuarioEditando(null);

    setForm({
      ...formInicial,
    });

    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setUsuarioEditando(
      usuario
    );

    setForm({
      nome:
        usuario.nome,

      email:
        usuario.email,

      senha: "",

      role:
        converterRole(
          usuario.role
        ),
    });

    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) {
      return;
    }

    setModalAberto(false);

    setUsuarioEditando(
      null
    );

    setForm({
      ...formInicial,
    });
  }

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function salvarUsuario(
    event
  ) {
    event.preventDefault();

    setSalvando(true);
    setErro("");

    try {
      if (usuarioEditando) {
        await api.put(
          `/Usuarios/${usuarioEditando.id}`,
          {
            nome:
              form.nome,

            email:
              form.email,
          }
        );

        const roleAtual =
          converterRole(
            usuarioEditando.role
          );

        const alterouRole =
          roleAtual !==
          form.role;

        const ehProprioUsuario =
          usuarioEditando.id ===
          user?.id;

        if (
          alterouRole &&
          !ehProprioUsuario
        ) {
          await api.patch(
            `/Usuarios/${usuarioEditando.id}/role`,
            {
              role:
                form.role ===
                "Admin"
                  ? 2
                  : 1,
            }
          );
        }
      } else {
        await api.post(
          "/Usuarios",
          {
            nome:
              form.nome,

            email:
              form.email,

            senha:
              form.senha,
          }
        );
      }

      await carregarUsuarios();

      setModalAberto(false);

      setUsuarioEditando(
        null
      );

      setForm({
        ...formInicial,
      });
    } catch (error) {
      console.error(
        "Erro ao salvar usuário:",
        error
      );

      const mensagem =
        error.response
          ?.data
          ?.mensagem;

      if (
        error.response?.status === 403
      ) {
        await sincronizarUsuario();

        setErro(
          "Seu perfil foi atualizado e você não possui mais permissão para realizar esta operação."
        );

        setModalAberto(false);
        setUsuarioEditando(null);
      } else if (
        error.response?.status !== 401
      ) {
        setErro(
          mensagem ||
            "Não foi possível salvar o usuário."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluirUsuario(
    usuario
  ) {
    if (
      usuario.id ===
      user?.id
    ) {
      window.alert(
        "Você não pode excluir sua própria conta."
      );

      return;
    }

    const confirmar =
      window.confirm(
        `Deseja realmente excluir ${usuario.nome}?`
      );

    if (!confirmar) {
      return;
    }

    setErro("");

    try {
      await api.delete(
        `/Usuarios/${usuario.id}`
      );

      setUsuarios(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              usuario.id
          )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir usuário:",
        error
      );

      const mensagem =
        error.response
          ?.data
          ?.mensagem;

      if (
        error.response?.status === 403
      ) {
        await sincronizarUsuario();

        setErro(
          "Seu perfil foi atualizado e você não possui mais permissão para excluir usuários."
        );
      } else if (
        error.response?.status !== 401
      ) {
        setErro(
          mensagem ||
            "Não foi possível excluir o usuário."
        );
      }
    }
  }

  return (
    <div className="users-page">
      <div className="users-page-header">
        <div className="page-title">
          <h1>
            Usuários
          </h1>

          <p>
            Gerencie os usuários
            cadastrados no sistema.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={
            abrirNovoUsuario
          }
        >
          <Plus size={19} />

          Novo usuário
        </button>
      </div>

      <section className="users-toolbar">
        <div className="search-field">
          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value
              )
            }
          />
        </div>
      </section>

      {erro && (
        <div className="page-error">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="tasks-loading">
          Carregando usuários...
        </div>
      ) : (
        <section className="users-table-wrapper">
          <div className="users-table-header">
            <span>
              Usuário
            </span>

            <span>
              E-mail
            </span>

            <span>
              Perfil
            </span>

            <span>
              Ações
            </span>
          </div>

          <AnimatePresence>
            {usuariosFiltrados.map(
              (usuario) => {
                const role =
                  converterRole(
                    usuario.role
                  );

                const ehUsuarioAtual =
                  usuario.id ===
                  user?.id;

                return (
                  <motion.div
                    className="users-table-row"
                    key={
                      usuario.id
                    }
                    layout
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.98,
                    }}
                  >
                    <div className="user-info-cell">
                      <div className="user-list-avatar">
                        <User
                          size={
                            18
                          }
                        />
                      </div>

                      <strong>
                        {
                          usuario.nome
                        }

                        {ehUsuarioAtual &&
                          " (você)"}
                      </strong>
                    </div>

                    <span>
                      {
                        usuario.email
                      }
                    </span>

                    <span
                      className={`user-role ${
                        role ===
                        "Admin"
                          ? "admin"
                          : "user"
                      }`}
                    >
                      {role ===
                        "Admin" && (
                        <ShieldCheck
                          size={
                            15
                          }
                        />
                      )}

                      {role}
                    </span>

                    <div className="user-row-actions">
                      <button
                        type="button"
                        title="Editar usuário"
                        onClick={() =>
                          abrirEdicao(
                            usuario
                          )
                        }
                      >
                        <Pencil
                          size={
                            17
                          }
                        />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        title={
                          ehUsuarioAtual
                            ? "Você não pode excluir sua própria conta"
                            : "Excluir usuário"
                        }
                        disabled={
                          ehUsuarioAtual
                        }
                        onClick={() =>
                          excluirUsuario(
                            usuario
                          )
                        }
                      >
                        <Trash2
                          size={
                            17
                          }
                        />
                      </button>
                    </div>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>

          {usuariosFiltrados.length ===
            0 && (
            <div className="empty-state">
              <h3>
                Nenhum usuário
                encontrado
              </h3>

              <p>
                Tente pesquisar por
                outro nome ou e-mail.
              </p>
            </div>
          )}
        </section>
      )}

      <AnimatePresence>
        {modalAberto && (
          <div
            className="modal-backdrop"
            onMouseDown={
              fecharModal
            }
          >
            <motion.div
              className="user-modal"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              onMouseDown={(
                event
              ) =>
                event.stopPropagation()
              }
            >
              <div className="modal-header">
                <div>
                  <h2>
                    {usuarioEditando
                      ? "Editar usuário"
                      : "Novo usuário"}
                  </h2>

                  <p>
                    {usuarioEditando
                      ? "Atualize os dados e o perfil do usuário."
                      : "Preencha os dados do novo usuário."}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={
                    fecharModal
                  }
                  disabled={
                    salvando
                  }
                  aria-label="Fechar"
                >
                  <X
                    size={
                      20
                    }
                  />
                </button>
              </div>

              <form
                className="task-form"
                onSubmit={
                  salvarUsuario
                }
              >
                <div className="form-group">
                  <label htmlFor="nome">
                    Nome
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    value={
                      form.nome
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Nome do usuário"
                    disabled={
                      salvando
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    E-mail
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="usuario@email.com"
                    disabled={
                      salvando
                    }
                    required
                  />
                </div>

                {usuarioEditando && (
                  <div className="form-group">
                    <label htmlFor="role">
                      Perfil
                    </label>

                    <select
                      id="role"
                      name="role"
                      value={
                        form.role
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        salvando ||
                        usuarioEditando.id ===
                          user?.id
                      }
                    >
                      <option value="User">
                        User
                      </option>

                      <option value="Admin">
                        Admin
                      </option>
                    </select>

                    {usuarioEditando.id ===
                      user?.id && (
                      <small>
                        Você não pode
                        alterar o perfil
                        da sua própria
                        conta.
                      </small>
                    )}
                  </div>
                )}

                {!usuarioEditando && (
                  <div className="form-group">
                    <label htmlFor="senha">
                      Senha
                    </label>

                    <input
                      id="senha"
                      name="senha"
                      type="password"
                      value={
                        form.senha
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Senha inicial"
                      disabled={
                        salvando
                      }
                      required
                      minLength={
                        6
                      }
                    />
                  </div>
                )}

                {!usuarioEditando && (
                  <div className="user-form-info">
                    O novo usuário será
                    criado inicialmente
                    com o perfil User.
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      fecharModal
                    }
                    disabled={
                      salvando
                    }
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={
                      salvando
                    }
                  >
                    {salvando
                      ? "Salvando..."
                      : usuarioEditando
                        ? "Salvar alterações"
                        : "Criar usuário"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Usuarios;