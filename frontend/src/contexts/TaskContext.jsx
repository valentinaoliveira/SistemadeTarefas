
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

function statusParaNumero(status) {
  switch (status) {
    case "Em andamento": return 2;
    case "Concluída": return 3;
    default: return 1;
  }
}

function prioridadeParaNumero(prioridade) {
  switch (prioridade) {
    case "Baixa": return 1;
    case "Alta": return 3;
    default: return 2;
  }
}

function numeroParaStatus(status) {
  switch (status) {
    case 2:
    case "EmAndamento": return "Em andamento";
    case 3:
    case "Concluida": return "Concluída";
    default: return "Pendente";
  }
}

function numeroParaPrioridade(prioridade) {
  switch (prioridade) {
    case 1:
    case "Baixa": return "Baixa";
    case 3:
    case "Alta": return "Alta";
    default: return "Média";
  }
}

function normalizarTarefa(tarefa) {
  return {
    ...tarefa,
    status: numeroParaStatus(tarefa.status),
    prioridade: numeroParaPrioridade(tarefa.prioridade),
    dataVencimento: tarefa.dataVencimento ?? null,
  };
}

function converterVencimento(valor) {
  if (!valor) return null;

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    throw new Error("Data de vencimento inválida.");
  }

  return data.toISOString();
}

export function TaskProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarTarefas = useCallback(async () => {
    if (!isAuthenticated) {
      setTarefas([]);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const response = await api.get("/Tarefas");
      setTarefas(response.data.map(normalizarTarefa));
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);

      if (error.response?.status !== 401) {
        setErro("Não foi possível carregar as tarefas.");
      }
    } finally {
      setCarregando(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  async function criarTarefa(dados) {
    setErro("");

    try {
      const response = await api.post("/Tarefas", {
        titulo: dados.titulo,
        descricao: dados.descricao || null,
        status: statusParaNumero(dados.status),
        prioridade: prioridadeParaNumero(dados.prioridade),
        dataVencimento: converterVencimento(
          dados.dataVencimento
        ),
      });

      const novaTarefa = normalizarTarefa(response.data);

      setTarefas((current) => [
        novaTarefa,
        ...current,
      ]);

      return novaTarefa;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);

      if (error.response?.status !== 401) {
        setErro("Não foi possível criar a tarefa.");
      }

      throw error;
    }
  }

  async function atualizarTarefa(id, dados) {
    setErro("");

    try {
      const tarefaAtual = tarefas.find(
        (tarefa) => tarefa.id === id
      );

      if (!tarefaAtual) {
        throw new Error("Tarefa não encontrada.");
      }

      const atualizada = {
        ...tarefaAtual,
        ...dados,
      };

      await api.put(`/Tarefas/${id}`, {
        titulo: atualizada.titulo,
        descricao: atualizada.descricao || null,
        status: statusParaNumero(atualizada.status),
        prioridade: prioridadeParaNumero(
          atualizada.prioridade
        ),
        dataConclusao:
          atualizada.status === "Concluída"
            ? atualizada.dataConclusao ||
              new Date().toISOString()
            : null,
        dataVencimento: converterVencimento(
          atualizada.dataVencimento
        ),
      });

      await carregarTarefas();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);

      if (error.response?.status !== 401) {
        setErro("Não foi possível atualizar a tarefa.");
      }

      throw error;
    }
  }

  async function excluirTarefa(id) {
    setErro("");

    try {
      await api.delete(`/Tarefas/${id}`);

      setTarefas((current) =>
        current.filter((tarefa) => tarefa.id !== id)
      );

      return true;
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);

      if (error.response?.status !== 401) {
        setErro("Não foi possível excluir a tarefa.");
      }

      throw error;
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tarefas,
        carregando,
        erro,
        carregarTarefas,
        criarTarefa,
        atualizarTarefa,
        excluirTarefa,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
