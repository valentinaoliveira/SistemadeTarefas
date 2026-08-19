using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Application.DTOs.Usuario;

public class UsuarioResponseDto
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public DateTime DataCriacao { get; set; }
}