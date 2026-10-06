import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

const initialForm = {
  titulo: "",
  descricao: "",
  status: "Pendente",
  prioridade: "Média",
};

function TaskForm({
  tarefa,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (tarefa) {
      setForm({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || "",
        status: tarefa.status,
        prioridade: tarefa.prioridade,
      });
    } else {
      setForm(initialForm);
    }
  }, [tarefa]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave(form);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <motion.div
        className="task-modal"
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
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <h2>
              {tarefa
                ? "Editar tarefa"
                : "Nova tarefa"}
            </h2>

            <p>
              {tarefa
                ? "Atualize as informações da tarefa."
                : "Preencha as informações abaixo."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="task-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="titulo">
              Título
            </label>

            <input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              placeholder="Ex: Estudar React"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">
              Descrição
            </label>

            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva a tarefa..."
              rows="4"
            />
          </div>

          <div className="task-form-row">
            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
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

            <div className="form-group">
              <label htmlFor="prioridade">
                Prioridade
              </label>

              <select
                id="prioridade"
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
              >
                <option value="Baixa">
                  Baixa
                </option>

                <option value="Média">
                  Média
                </option>

                <option value="Alta">
                  Alta
                </option>

              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {tarefa
                ? "Salvar alterações"
                : "Criar tarefa"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default TaskForm;