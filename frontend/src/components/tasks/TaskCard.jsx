
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Edit3,
  PlayCircle,
  Trash2,
} from "lucide-react";

import { motion } from "motion/react";

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
  if (status === "Concluída") return "completed";
  if (status === "Em andamento") return "progress";
  return "pending";
}

function getPriorityClass(prioridade) {
  return (prioridade || "Média")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obterPrazo(tarefa) {
  if (!tarefa.dataVencimento) return null;

  const data = new Date(tarefa.dataVencimento);

  if (Number.isNaN(data.getTime())) return null;

  const concluida = tarefa.status === "Concluída";
  const diferenca = data.getTime() - Date.now();

  const texto = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);

  if (concluida) {
    return { texto, classe: "completed", mensagem: "Concluída" };
  }

  if (diferenca < 0) {
    return { texto, classe: "overdue", mensagem: "Atrasada" };
  }

  if (diferenca <= 24 * 60 * 60 * 1000) {
    return {
      texto,
      classe: "soon",
      mensagem: "Vence em breve",
    };
  }

  return { texto, classe: "normal", mensagem: "No prazo" };
}

function TaskCard({ tarefa, onEdit, onDelete }) {
  const prioridade = tarefa.prioridade || "Média";
  const status = tarefa.status || "Pendente";
  const prazo = obterPrazo(tarefa);

  return (
    <motion.article
      className="task-card"
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
    >
      <div className="task-card-top">
        <span
          className={`task-priority ${getPriorityClass(prioridade)}`}
        >
          {prioridade}
        </span>

        <div className="task-actions">
          <button
            type="button"
            title="Editar tarefa"
            onClick={() => onEdit(tarefa)}
          >
            <Edit3 size={17} />
          </button>

          <button
            type="button"
            className="delete"
            title="Excluir tarefa"
            onClick={() => onDelete(tarefa.id)}
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <h3>{tarefa.titulo}</h3>

      <p className="task-description">
        {tarefa.descricao || "Nenhuma descrição informada."}
      </p>

      {prazo && (
        <div className={`task-deadline ${prazo.classe}`}>
          {prazo.classe === "overdue" ? (
            <AlertCircle size={16} />
          ) : (
            <CalendarClock size={16} />
          )}

          <div>
            <span>{prazo.texto}</span>
            <small>{prazo.mensagem}</small>
          </div>
        </div>
      )}

      <div className="task-card-footer">
        <span
          className={`task-status ${getStatusClass(status)}`}
        >
          {getStatusIcon(status)}
          {status}
        </span>
      </div>
    </motion.article>
  );
}

export default TaskCard;
