using SistemaTarefas.Application.DTOs.Tarefa;

namespace SistemaTarefas.Application.Interfaces;

public interface ITarefaService
{
    Task<List<TarefaResponseDto>> GetAllAsync();

    Task<TarefaResponseDto?> GetByIdAsync(int id);

    Task<List<TarefaResponseDto>> GetByUsuarioIdAsync(
        int usuarioId
    );

    Task<TarefaResponseDto> CreateAsync(
        CriarTarefaDto dto,
        int usuarioId
    );

    Task<bool> UpdateAsync(
        int id,
        AtualizarTarefaDto dto
    );

    Task<bool> DeleteAsync(int id);
}