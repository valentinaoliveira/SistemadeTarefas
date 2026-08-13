using SistemaTarefas.Application.DTOs.Usuario;

namespace SistemaTarefas.Application.Interfaces;
public interface IUsuarioService
{
    Task<List<UsuarioResponseDto>> GetAllAsync();

    Task<UsuarioResponseDto?> GetByIdAsync(int id);

    Task<UsuarioResponseDto> CreateAsync(CriarUsuarioDto dto);

    Task<bool> UpdateAsync(int id, AtualizarUsuarioDto dto);

    Task<bool> DeleteAsync(int id);
}