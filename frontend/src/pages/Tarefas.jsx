import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Filter,
  Plus,
  Search,
} from "lucide-react";

import { AnimatePresence } from "motion/react";

import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";

import { useTasks } from "../contexts/TaskContext";

function Tarefas() {
  const {
    tarefas,
    carregando,
    erro,
    carregarTarefas,
    criarTarefa,
    atualizarTarefa,
    excluirTarefa,
  } = useTasks();

  const [busca, setBusca] =
    useState("");

  const [
    statusFiltro,
    setStatusFiltro,
  ] = useState("Todos");

  const [
    modalAberto,
    setModalAberto,
  ] = useState(false);

  const [
    tarefaEditando,
    setTarefaEditando,
  ] = useState(null);

  const [salvando, setSalvando] =
    useState(false);

  useEffect(() => {
    carregarTarefas().catch(() => {
      // O erro já é tratado no Context.
    });
  }, [carregarTarefas]);

  const tarefasFiltradas =
    useMemo(() => {
      const termo =
        busca
          .trim()
          .toLowerCase();

      return tarefas.filter(
        (tarefa) => {
          const titulo =
            tarefa.titulo
              ?.toLowerCase() ?? "";

          const descricao =
            tarefa.descricao
              ?.toLowerCase() ?? "";

          const correspondeBusca =
            titulo.includes(termo) ||
            descricao.includes(termo);

          const correspondeStatus =
            statusFiltro === "Todos" ||
            tarefa.status ===
              statusFiltro;

          return (
            correspondeBusca &&
            correspondeStatus
          );
        }
      );
    }, [
      tarefas,
      busca,
      statusFiltro,
    ]);

  function abrirNovaTarefa() {
    setTarefaEditando(null);
    setModalAberto(true);
  }

  function editarTarefa(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) {
      return;
    }

    setModalAberto(false);
    setTarefaEditando(null);
  }

  async function salvarTarefa(dados) {
    setSalvando(true);

    try {
      if (tarefaEditando) {
        await atualizarTarefa(
          tarefaEditando.id,
          dados
        );
      } else {
        await criarTarefa(dados);
      }

      setModalAberto(false);
      setTarefaEditando(null);
    } catch {
      // O erro já é tratado
      // pelo TaskContext.
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluirTarefa(
    id
  ) {
    const confirmar =
      window.confirm(
        "Deseja realmente excluir esta tarefa?"
      );

    if (!confirmar) {
      return;
    }

    try {
      await excluirTarefa(id);
    } catch {
      // O erro já é tratado
      // pelo TaskContext.
    }
  }

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div className="page-title">
          <h1>
            Tarefas
          </h1>

          <p>
            Organize e acompanhe todas
            as suas atividades.
          </p>
        </div>

        <button
          type="button"
          className="primary-button new-task-button"
          onClick={abrirNovaTarefa}
        >
          <Plus size={19} />

          Nova tarefa
        </button>
      </div>

      <section className="task-toolbar">
        <div className="search-field">
          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={busca}
            onChange={(event) =>
              setBusca(
                event.target.value
              )
            }
          />
        </div>

        <div className="filter-field">
          <Filter size={18} />

          <select
            value={statusFiltro}
            onChange={(event) =>
              setStatusFiltro(
                event.target.value
              )
            }
          >
            <option value="Todos">
              Todos
            </option>

            <option value="Pendente">
              Pendente
            </option>

            <option value="Em andamento">
              Em andamento
            </option>

            <option value="Concluída">
              Concluída
            </option>
          </select>
        </div>
      </section>

      {erro && (
        <div className="page-error">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="tasks-loading">
          Carregando tarefas...
        </div>
      ) : (
        <>
          <div className="task-count">
            {tarefasFiltradas.length}
            {" "}
            tarefa(s)
          </div>

          <section className="tasks-grid">
            <AnimatePresence>
              {tarefasFiltradas.map(
                (tarefa) => (
                  <TaskCard
                    key={tarefa.id}
                    tarefa={tarefa}
                    onEdit={() =>
                      editarTarefa(
                        tarefa
                      )
                    }
                    onDelete={
                      handleExcluirTarefa
                    }
                  />
                )
              )}
            </AnimatePresence>
          </section>

          {tarefasFiltradas.length ===
            0 && (
            <div className="empty-state">
              <h3>
                Nenhuma tarefa encontrada
              </h3>

              <p>
                Crie uma nova tarefa ou
                altere os filtros.
              </p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {modalAberto && (
          <TaskForm
            tarefa={tarefaEditando}
            onClose={fecharModal}
            onSave={salvarTarefa}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tarefas;