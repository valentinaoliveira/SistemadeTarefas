namespace SistemaTarefas.Application.DTOs.Usuario;

public class AlterarSenhaUsuarioDto
{
    public string SenhaAtual { get; set; } = string.Empty;

    public string NovaSenha { get; set; } = string.Empty;

    public string ConfirmarNovaSenha { get; set; } = string.Empty;
}