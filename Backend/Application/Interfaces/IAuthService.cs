using SistemaTarefas.Application.DTOs.Auth;

namespace SistemaTarefas.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}