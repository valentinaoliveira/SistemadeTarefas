using SistemaTarefas.Application.DTOs.Auth;

namespace SistemaTarefas.Infrastructure.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginDto dto);
}