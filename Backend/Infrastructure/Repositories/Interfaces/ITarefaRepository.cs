using SistemaTarefas.Domain.Entities;

namespace SistemaTarefas.Infrastructure.Repositories.Interfaces;

public interface ITarefaRepository
{
    Task<Tarefa?> GetByIdAsync(int id);

    Task<List<Tarefa>> GetAllAsync();

    Task<List<Tarefa>> GetByUsuarioIdAsync(int usuarioId);

    Task<Tarefa> AddAsync(Tarefa tarefa);

    Task UpdateAsync(Tarefa tarefa);

    Task DeleteAsync(Tarefa tarefa);
}