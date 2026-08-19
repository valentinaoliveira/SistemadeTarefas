import { useMemo, useState } from "react";
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
  criarTarefa,
  atualizarTarefa,
  excluirTarefa,
} = useTasks();

  const [busca, setBusca] =
    useState("");

  const [statusFiltro, setStatusFiltro] =
    useState("Todos");

  const [modalAberto, setModalAberto] =
    useState(false);

  const [tarefaEditando, setTarefaEditando] =
    useState(null);

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter((tarefa) => {
      const correspondeBusca =
        tarefa.titulo
          .toLowerCase()
          .includes(busca.toLowerCase()) ||
        tarefa.descricao
          ?.toLowerCase()
          .includes(busca.toLowerCase());

      const correspondeStatus =
        statusFiltro === "Todos" ||
        tarefa.status === statusFiltro;

      return (
        correspondeBusca &&
        correspondeStatus
      );
    });
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
    setModalAberto(false);
    setTarefaEditando(null);
  }

function salvarTarefa(dados) {
  if (tarefaEditando) {
    atualizarTarefa(
      tarefaEditando.id,
      dados
    );
  } else {
    criarTarefa(dados);
  }

  fecharModal();
}

 function handleExcluirTarefa(id) {
  const confirmar = window.confirm(
    "Deseja realmente excluir esta tarefa?"
  );

  if (!confirmar) {
    return;
  }

  excluirTarefa(id);
}

  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <div className="page-title">
          <h1>Tarefas</h1>

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
              setBusca(event.target.value)
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
            <option>
              Todos
            </option>

            <option>
              Pendente
            </option>

            <option>
              Em andamento
            </option>

            <option>
              Concluída
            </option>
          </select>
        </div>
      </section>

      <div className="task-count">
        {tarefasFiltradas.length} tarefa(s)
      </div>

      <section className="tasks-grid">
        <AnimatePresence>
          {tarefasFiltradas.map(
            (tarefa) => (
              <TaskCard
                key={tarefa.id}
                tarefa={tarefa}
                onEdit={editarTarefa}
               onDelete={handleExcluirTarefa}
              />
            )
          )}
        </AnimatePresence>
      </section>

      {tarefasFiltradas.length === 0 && (
        <div className="empty-state">
          <h3>
            Nenhuma tarefa encontrada
          </h3>

          <p>
            Tente alterar os filtros ou
            crie uma nova tarefa.
          </p>
        </div>
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