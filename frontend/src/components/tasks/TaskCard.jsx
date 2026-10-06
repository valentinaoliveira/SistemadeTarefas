import {
  CheckCircle2,
  Clock3,
  Edit3,
  PlayCircle,
  Trash2,
} from "lucide-react";

import { motion } from "motion/react";

function TaskCard({
  tarefa,
  onEdit,
  onDelete,
}) {
  function getStatusIcon(status) {
    if (status === "Concluída") {
      return <CheckCircle2 size={17} />;
    }

    if (status === "Em andamento") {
      return <PlayCircle size={17} />;
    }

    return <Clock3 size={17} />;
  }

  function getStatusClass(status) {
    if (status === "Concluída") {
      return "completed";
    }

    if (status === "Em andamento") {
      return "progress";
    }

    return "pending";
  }

  function getPriorityClass(prioridade) {
    if (!prioridade) {
      return "media";
    }

    return prioridade
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const prioridade =
    tarefa.prioridade || "Média";

  const status =
    tarefa.status || "Pendente";

  return (
    <motion.article
      className="task-card"
      layout
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      whileHover={{
        y: -3,
      }}
    >
      <div className="task-card-top">
        <span
          className={`task-priority ${getPriorityClass(
            prioridade
          )}`}
        >
          {prioridade}
        </span>

        <div className="task-actions">
          <button
            type="button"
            title="Editar tarefa"
            onClick={() =>
              onEdit(tarefa)
            }
          >
            <Edit3 size={17} />
          </button>

          <button
            type="button"
            className="delete"
            title="Excluir tarefa"
            onClick={() =>
              onDelete(tarefa.id)
            }
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h3>
        {tarefa.titulo}
      </h3>

      <p className="task-description">
        {tarefa.descricao ||
          "Nenhuma descrição informada."}
      </p>

      <div className="task-card-footer">
        <span
          className={`task-status ${getStatusClass(
            status
          )}`}
        >
          {getStatusIcon(status)}

          {status}
        </span>
      </div>
    </motion.article>
  );
}

export default TaskCard;