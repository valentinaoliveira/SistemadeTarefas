
using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Application.DTOs.Tarefa;

public class TarefaResponseDto
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public TarefaStatus Status { get; set; }

    public Prioridade Prioridade { get; set; }

    public DateTime DataCriacao { get; set; }

    public DateTime? DataConclusao { get; set; }

    public DateTime? DataVencimento { get; set; }

    public int UsuarioId { get; set; }
}
