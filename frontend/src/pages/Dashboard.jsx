import { useMemo } from "react";
import { useNavigate } from "react-router";
import {
  AlertTriangle, ArrowRight, CalendarClock, CheckCircle2,
  Clock3, ListTodo, Plus, PlayCircle, TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useTasks } from "../contexts/TaskContext";
import "../styles/dashboard-extra.css";

const formatarData = (valor) => {
  if (!valor) return "Sem prazo";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "Data inválida"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

function Dashboard() {
  const navigate = useNavigate();
  const { tarefas, carregando, erro } = useTasks();

  const dados = useMemo(() => {
    const agora = Date.now();
    const limite = agora + 24 * 60 * 60 * 1000;
    const concluidas = tarefas.filter((t) => t.status === "Concluída").length;
    const comPrazo = tarefas
      .filter((t) => t.dataVencimento && t.status !== "Concluída")
      .map((t) => ({ ...t, vencimentoMs: new Date(t.dataVencimento).getTime() }))
      .filter((t) => Number.isFinite(t.vencimentoMs))
      .sort((a, b) => a.vencimentoMs - b.vencimentoMs);

    return {
      total: tarefas.length,
      pendentes: tarefas.filter((t) => t.status === "Pendente").length,
      andamento: tarefas.filter((t) => t.status === "Em andamento").length,
      concluidas,
      atrasadas: comPrazo.filter((t) => t.vencimentoMs < agora).length,
      proximas24h: comPrazo.filter((t) => t.vencimentoMs >= agora && t.vencimentoMs <= limite).length,
      vencimentos: comPrazo.slice(0, 5),
      recentes: [...tarefas].sort((a, b) => new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0)).slice(0, 5),
      percentual: tarefas.length ? Math.round((concluidas / tarefas.length) * 100) : 0,
      agora,
      limite,
    };
  }, [tarefas]);

  const indicadores = [
    { titulo: "Total de tarefas", valor: dados.total, icon: ListTodo, tipo: "total" },
    { titulo: "Pendentes", valor: dados.pendentes, icon: Clock3, tipo: "pending" },
    { titulo: "Em andamento", valor: dados.andamento, icon: PlayCircle, tipo: "progress" },
    { titulo: "Concluídas", valor: dados.concluidas, icon: CheckCircle2, tipo: "completed" },
    { titulo: "Atrasadas", valor: dados.atrasadas, icon: AlertTriangle, tipo: "overdue" },
    { titulo: "Vencem em 24h", valor: dados.proximas24h, icon: CalendarClock, tipo: "soon" },
  ];

  function situacao(tarefa) {
    if (tarefa.vencimentoMs < dados.agora) return { texto: "Atrasada", tipo: "overdue" };
    if (tarefa.vencimentoMs <= dados.limite) return { texto: "Próximas 24h", tipo: "soon" };
    return { texto: "No prazo", tipo: "normal" };
  }

  return (
    <div className="dashboard dashboard-new">
      <div className="dashboard-heading">
        <div className="page-title">
          <h1>Visão geral</h1>
          <p>Acompanhe o progresso, as prioridades e os próximos prazos.</p>
        </div>
        <button className="primary-button" onClick={() => navigate("/tarefas")} type="button">
          <Plus size={18} /> Gerenciar tarefas
        </button>
      </div>

      {erro && <div className="page-error">{erro}</div>}
      {carregando && tarefas.length === 0 ? (
        <div className="tasks-loading">Carregando dashboard...</div>
      ) : (
        <>
          <section className="dashboard-progress" aria-label="Progresso geral das tarefas">
            <div className="dashboard-progress-top">
              <div className="dashboard-progress-title">
                <span className="dashboard-progress-symbol"><TrendingUp size={22} /></span>
                <div><h2>Seu progresso</h2><p>{dados.concluidas} de {dados.total} tarefas concluídas</p></div>
              </div>
              <strong>{dados.percentual}%</strong>
            </div>
            <div className="dashboard-progress-track" role="progressbar" aria-valuenow={dados.percentual} aria-valuemin={0} aria-valuemax={100} aria-label="Tarefas concluídas">
              <div className="dashboard-progress-fill" style={{ width: `${dados.percentual}%` }} />
            </div>
          </section>

          <section className="dashboard-cards dashboard-stats" aria-label="Indicadores das tarefas">
            {indicadores.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article key={item.titulo} className="dashboard-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <div className={`dashboard-card-icon ${item.tipo}`}><Icon size={22} /></div>
                  <div><span>{item.titulo}</span><strong>{item.valor}</strong></div>
                </motion.article>
              );
            })}
          </section>

          <div className="dashboard-sections">
            <section className="recent-tasks dashboard-panel">
              <div className="section-header dashboard-panel-header">
                <div><h2>Próximos vencimentos</h2><p>Tarefas com prazos que precisam de atenção.</p></div>
                <CalendarClock size={21} />
              </div>
              {dados.vencimentos.length ? (
                <div className="dashboard-items">
                  {dados.vencimentos.map((tarefa) => {
                    const estado = situacao(tarefa);
                    return (
                      <div className="dashboard-item" key={tarefa.id}>
                        <div className="dashboard-item-info"><strong>{tarefa.titulo}</strong><span>{formatarData(tarefa.dataVencimento)}</span></div>
                        <span className={`dashboard-deadline-badge ${estado.tipo}`}>{estado.texto}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="dashboard-empty">Nenhuma tarefa pendente com vencimento.</p>}
            </section>

            <section className="recent-tasks dashboard-panel">
              <div className="section-header dashboard-panel-header">
                <div><h2>Tarefas recentes</h2><p>Suas últimas atividades cadastradas.</p></div>
                <button className="dashboard-text-link" onClick={() => navigate("/tarefas")} type="button">Ver todas <ArrowRight size={16} /></button>
              </div>
              {dados.recentes.length ? (
                <div className="dashboard-items">
                  {dados.recentes.map((tarefa) => (
                    <div className="dashboard-item" key={tarefa.id}>
                      <div className="dashboard-item-info"><strong>{tarefa.titulo}</strong><span>Prioridade: {tarefa.prioridade}</span></div>
                      <span className={`dashboard-status-pill ${tarefa.status === "Concluída" ? "completed" : tarefa.status === "Em andamento" ? "progress" : "pending"}`}>{tarefa.status}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="dashboard-empty">Você ainda não possui tarefas.</p>}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
