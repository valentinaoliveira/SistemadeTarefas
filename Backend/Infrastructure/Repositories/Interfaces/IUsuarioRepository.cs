using SistemaTarefas.Domain.Entities;

namespace SistemaTarefas.Infrastructure.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByIdAsync(int id);

    Task<Usuario?> GetByEmailAsync(string email);

    Task<List<Usuario>> GetAllAsync();

    Task<Usuario> AddAsync(Usuario usuario);

    Task UpdateAsync(Usuario usuario);

    Task DeleteAsync(Usuario usuario);
}