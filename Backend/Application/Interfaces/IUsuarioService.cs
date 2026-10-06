using SistemaTarefas.Application.DTOs.Usuario;
using SistemaTarefas.Domain.Enums;

namespace SistemaTarefas.Application.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioResponseDto>> GetAllAsync();

    Task<UsuarioResponseDto?> GetByIdAsync(int id);

    Task<UsuarioResponseDto> CreateAsync(
        CriarUsuarioDto dto
    );

    Task<bool> UpdateAsync(
        int id,
        AtualizarUsuarioDto dto
    );

    Task<bool> AlterarRoleAsync(
        int id,
        UserRole role
    );

    Task<bool> DeleteAsync(int id);
}