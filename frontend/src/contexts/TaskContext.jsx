import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const TaskContext = createContext();

const tarefasIniciais = [
  {
    id: 1,
    titulo: "Finalizar projeto C#",
    descricao:
      "Continuar a implementação do Sistema de Tarefas.",
    status: "Em andamento",
    prioridade: "Alta",
  },
  {
    id: 2,
    titulo: "Estudar React",
    descricao:
      "Praticar componentes, hooks e context.",
    status: "Pendente",
    prioridade: "Média",
  },
  {
    id: 3,
    titulo: "Revisar banco SQLite",
    descricao:
      "Revisar Entity Framework e migrations.",
    status: "Concluída",
    prioridade: "Baixa",
  },
];

export function TaskProvider({ children }) {
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas =
      localStorage.getItem("tarefas");

    if (tarefasSalvas) {
      return JSON.parse(tarefasSalvas);
    }

    return tarefasIniciais;
  });

  useEffect(() => {
    localStorage.setItem(
      "tarefas",
      JSON.stringify(tarefas)
    );
  }, [tarefas]);

  function criarTarefa(dados) {
    const novaTarefa = {
      id: Date.now(),
      ...dados,
    };

    setTarefas((current) => [
      novaTarefa,
      ...current,
    ]);
  }

  function atualizarTarefa(id, dados) {
    setTarefas((current) =>
      current.map((tarefa) =>
        tarefa.id === id
          ? {
              ...tarefa,
              ...dados,
            }
          : tarefa
      )
    );
  }

  function excluirTarefa(id) {
    setTarefas((current) =>
      current.filter(
        (tarefa) => tarefa.id !== id
      )
    );
  }

  return (
    <TaskContext.Provider
      value={{
        tarefas,
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