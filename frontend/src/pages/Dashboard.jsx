import {
  CheckCircle2,
  Clock3,
  ListTodo,
  PlayCircle,
} from "lucide-react";

import { motion } from "motion/react";
import { useTasks } from "../contexts/TaskContext";




function Dashboard() {const { tarefas } = useTasks();

const total = tarefas.length;

const pendentes = tarefas.filter(
  (tarefa) =>
    tarefa.status === "Pendente"
).length;

const emAndamento = tarefas.filter(
  (tarefa) =>
    tarefa.status === "Em andamento"
).length;

const concluidas = tarefas.filter(
  (tarefa) =>
    tarefa.status === "Concluída"
).length;

const cards = [
  {
    title: "Total de tarefas",
    value: total,
    icon: ListTodo,
    type: "total",
  },
  {
    title: "Pendentes",
    value: pendentes,
    icon: Clock3,
    type: "pending",
  },
  {
    title: "Em andamento",
    value: emAndamento,
    icon: PlayCircle,
    type: "progress",
  },
  {
    title: "Concluídas",
    value: concluidas,
    icon: CheckCircle2,
    type: "completed",
  },
];

const tarefasRecentes =
  tarefas.slice(0, 5);
  return (
    <div className="dashboard">
      <div className="page-title">
        <h1>Dashboard</h1>

        <p>
          Acompanhe um resumo das suas tarefas.
        </p>
      </div>

      <section className="dashboard-cards">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.article
              key={card.title}
              className="dashboard-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              whileHover={{
                y: -4,
              }}
            >
              <div
                className={`dashboard-card-icon ${card.type}`}
              >
                <Icon size={23} />
              </div>

              <div>
                <span>
                  {card.title}
                </span>

                <strong>
                  {card.value}
                </strong>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="recent-tasks">
        <div className="section-header">
          <div>
            <h2>Tarefas recentes</h2>

            <p>
              Veja suas atividades mais recentes.
            </p>
          </div>
        </div>

        <div className="task-table">
          <div className="task-table-header">
            <span>Tarefa</span>
            <span>Prioridade</span>
            <span>Status</span>
          </div>

          {tarefasRecentes.map((tarefa) => (
            <div
              className="task-table-row"
              key={tarefa.id}
            >
              <strong>
                {tarefa.titulo}
              </strong>

              <span>
                {tarefa.prioridade}
              </span>

              <span>
                {tarefa.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;