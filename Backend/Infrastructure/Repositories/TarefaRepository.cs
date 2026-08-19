using Microsoft.EntityFrameworkCore;
using SistemaTarefas.Domain.Entities;
using SistemaTarefas.Infrastructure.Data;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

namespace SistemaTarefas.Infrastructure.Repositories;

public class TarefaRepository : ITarefaRepository
{
    private readonly AppDbContext _context;

    public TarefaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Tarefa?> GetByIdAsync(int id)
    {
        return await _context.Tarefas
            .Include(t => t.Usuario)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<List<Tarefa>> GetAllAsync()
    {
        return await _context.Tarefas
            .Include(t => t.Usuario)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<Tarefa>> GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.Tarefas
            .Where(t => t.UsuarioId == usuarioId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Tarefa> AddAsync(Tarefa tarefa)
    {
        await _context.Tarefas.AddAsync(tarefa);
        await _context.SaveChangesAsync();

        return tarefa;
    }

    public async Task UpdateAsync(Tarefa tarefa)
    {
        _context.Tarefas.Update(tarefa);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Tarefa tarefa)
    {
        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();
    }
}