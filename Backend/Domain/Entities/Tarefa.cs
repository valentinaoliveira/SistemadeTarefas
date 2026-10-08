
using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Domain.Entities;

public class Tarefa
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string? Descricao { get; set; }

    public TarefaStatus Status { get; set; } = TarefaStatus.Pendente;

    public Prioridade Prioridade { get; set; } = Prioridade.Media;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public DateTime? DataConclusao { get; set; }

    // PRAZO DE VENCIMENTO
    public DateTime? DataVencimento { get; set; }

    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;
}
