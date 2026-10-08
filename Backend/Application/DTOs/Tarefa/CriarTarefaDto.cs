
using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Application.DTOs.Tarefa;

public class CriarTarefaDto
{
    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public TarefaStatus Status { get; set; } = TarefaStatus.Pendente;

    public Prioridade Prioridade { get; set; } = Prioridade.Media;

    // PRAZO DE VENCIMENTO
    public DateTime? DataVencimento { get; set; }
}
