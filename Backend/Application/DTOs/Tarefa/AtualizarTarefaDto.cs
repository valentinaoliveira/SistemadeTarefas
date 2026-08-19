using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Application.DTOs.Tarefa;

public class AtualizarTarefaDto
{
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public TarefaStatus Status { get; set; }

    public Prioridade Prioridade { get; set; }

    public DateTime? DataConclusao { get; set; }
}