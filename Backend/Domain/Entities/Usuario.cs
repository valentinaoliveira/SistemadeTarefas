using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    public ICollection<Tarefa> Tarefas { get; set; } = new List<Tarefa>();
}