import { useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const usuariosIniciais = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@email.com",
    role: "Admin",
  },
  {
    id: 2,
    nome: "Usuário Teste",
    email: "teste@email.com",
    role: "User",
  },
];

const formInicial = {
  nome: "",
  email: "",
  role: "User",
};

function Usuarios() {
  const [usuarios, setUsuarios] =
    useState(usuariosIniciais);

  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] =
    useState(false);

  const [usuarioEditando, setUsuarioEditando] =
    useState(null);

  const [form, setForm] = useState(formInicial);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();

    return usuarios.filter((usuario) => {
      return (
        usuario.nome
          .toLowerCase()
          .includes(termo) ||
        usuario.email
          .toLowerCase()
          .includes(termo)
      );
    });
  }, [usuarios, busca]);

  function abrirNovoUsuario() {
    setUsuarioEditando(null);
    setForm(formInicial);
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setUsuarioEditando(usuario);

    setForm({
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setUsuarioEditando(null);
    setForm(formInicial);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function salvarUsuario(event) {
    event.preventDefault();

    if (usuarioEditando) {
      setUsuarios((current) =>
        current.map((usuario) =>
          usuario.id === usuarioEditando.id
            ? {
                ...usuario,
                ...form,
              }
            : usuario
        )
      );
    } else {
      const novoUsuario = {
        id: Date.now(),
        ...form,
      };

      setUsuarios((current) => [
        novoUsuario,
        ...current,
      ]);
    }

    fecharModal();
  }

  function excluirUsuario(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir este usuário?"
    );

    if (!confirmar) {
      return;
    }

    setUsuarios((current) =>
      current.filter(
        (usuario) => usuario.id !== id
      )
    );
  }

  return (
    <div className="users-page">
      <div className="users-page-header">
        <div className="page-title">
          <h1>Usuários</h1>

          <p>
            Gerencie os usuários cadastrados
            no sistema.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={abrirNovoUsuario}
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
              setBusca(event.target.value)
            }
          />
        </div>
      </section>

      <section className="users-table-wrapper">
        <div className="users-table-header">
          <span>Usuário</span>
          <span>E-mail</span>
          <span>Perfil</span>
          <span>Ações</span>
        </div>

        <AnimatePresence>
          {usuariosFiltrados.map(
            (usuario) => (
              <motion.div
                className="users-table-row"
                key={usuario.id}
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
                    <User size={18} />
                  </div>

                  <strong>
                    {usuario.nome}
                  </strong>
                </div>

                <span>
                  {usuario.email}
                </span>

                <span
                  className={`user-role ${
                    usuario.role === "Admin"
                      ? "admin"
                      : "user"
                  }`}
                >
                  {usuario.role === "Admin" && (
                    <ShieldCheck size={15} />
                  )}

                  {usuario.role}
                </span>

                <div className="user-row-actions">
                  <button
                    type="button"
                    title="Editar usuário"
                    onClick={() =>
                      abrirEdicao(usuario)
                    }
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    className="delete"
                    title="Excluir usuário"
                    onClick={() =>
                      excluirUsuario(
                        usuario.id
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {usuariosFiltrados.length === 0 && (
          <div className="empty-state">
            <h3>
              Nenhum usuário encontrado
            </h3>

            <p>
              Tente pesquisar por outro nome
              ou e-mail.
            </p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {modalAberto && (
          <div
            className="modal-backdrop"
            onMouseDown={fecharModal}
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
              onMouseDown={(event) =>
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
                      ? "Atualize os dados do usuário."
                      : "Preencha os dados do novo usuário."}
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={fecharModal}
                >
                  <X size={20} />
                </button>
              </div>

              <form
                className="task-form"
                onSubmit={salvarUsuario}
              >
                <div className="form-group">
                  <label htmlFor="nome">
                    Nome
                  </label>

                  <input
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder="Nome do usuário"
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
                    value={form.email}
                    onChange={handleChange}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">
                    Perfil
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="User">
                      User
                    </option>

                    <option value="Admin">
                      Admin
                    </option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={fecharModal}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                  >
                    {usuarioEditando
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