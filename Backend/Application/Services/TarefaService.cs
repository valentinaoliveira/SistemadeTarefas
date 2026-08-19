using SistemaTarefas.Application.DTOs.Tarefa;
using SistemaTarefas.Application.Interfaces;
using SistemaTarefas.Domain.Entities;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

namespace SistemaTarefas.Application.Services;

public class TarefaService : ITarefaService
{
    private readonly ITarefaRepository _repository;

    public TarefaService(ITarefaRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<TarefaResponseDto>> GetAllAsync()
    {
        var tarefas = await _repository.GetAllAsync();

        return tarefas.Select(MapToResponse).ToList();
    }

    public async Task<TarefaResponseDto?> GetByIdAsync(int id)
    {
        var tarefa = await _repository.GetByIdAsync(id);

        if (tarefa == null)
            return null;

        return MapToResponse(tarefa);
    }

    public async Task<List<TarefaResponseDto>> GetByUsuarioIdAsync(
        int usuarioId)
    {
        var tarefas =
            await _repository.GetByUsuarioIdAsync(usuarioId);

        return tarefas.Select(MapToResponse).ToList();
    }

    public async Task<TarefaResponseDto> CreateAsync(
        CriarTarefaDto dto,
        int usuarioId)
    {
        var tarefa = new Tarefa
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            Status = dto.Status,
            Prioridade = dto.Prioridade,
            UsuarioId = usuarioId,
            DataCriacao = DateTime.UtcNow
        };

        var tarefaCriada = await _repository.AddAsync(tarefa);

        return MapToResponse(tarefaCriada);
    }

    public async Task<bool> UpdateAsync(
        int id,
        AtualizarTarefaDto dto)
    {
        var tarefa = await _repository.GetByIdAsync(id);

        if (tarefa == null)
            return false;

        tarefa.Titulo = dto.Titulo;
        tarefa.Descricao = dto.Descricao;
        tarefa.Status = dto.Status;
        tarefa.Prioridade = dto.Prioridade;
        tarefa.DataConclusao = dto.DataConclusao;

        await _repository.UpdateAsync(tarefa);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var tarefa = await _repository.GetByIdAsync(id);

        if (tarefa == null)
            return false;

        await _repository.DeleteAsync(tarefa);

        return true;
    }

    private static TarefaResponseDto MapToResponse(
        Tarefa tarefa)
    {
        return new TarefaResponseDto
        {
            Id = tarefa.Id,
            Titulo = tarefa.Titulo,
            Descricao = tarefa.Descricao,
            Status = tarefa.Status,
            Prioridade = tarefa.Prioridade,
            DataCriacao = tarefa.DataCriacao,
            DataConclusao = tarefa.DataConclusao,
            UsuarioId = tarefa.UsuarioId
        };
    }
}