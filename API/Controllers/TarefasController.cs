using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTarefas.Application.DTOs.Tarefa;
using SistemaTarefas.Application.Interfaces;

namespace SistemaTarefas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TarefasController : ControllerBase
{
    private readonly ITarefaService _tarefaService;

    public TarefasController(ITarefaService tarefaService)
    {
        _tarefaService = tarefaService;
    }

    private int GetUsuarioId()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(id))
            throw new UnauthorizedAccessException();

        return int.Parse(id);
    }

    [HttpGet]
    public async Task<IActionResult> GetMinhasTarefas()
    {
        var usuarioId = GetUsuarioId();

        var tarefas =
            await _tarefaService.GetByUsuarioIdAsync(usuarioId);

        return Ok(tarefas);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuarioId = GetUsuarioId();

        var tarefa =
            await _tarefaService.GetByIdAsync(id);

        if (tarefa == null)
            return NotFound();

        if (tarefa.UsuarioId != usuarioId)
            return Forbid();

        return Ok(tarefa);
    }

    [HttpPost]
    public async Task<IActionResult> Criar(
        [FromBody] CriarTarefaDto dto)
    {
        var usuarioId = GetUsuarioId();

        var tarefa =
            await _tarefaService.CreateAsync(
                dto,
                usuarioId
            );

        return CreatedAtAction(
            nameof(GetById),
            new { id = tarefa.Id },
            tarefa
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(
        int id,
        [FromBody] AtualizarTarefaDto dto)
    {
        var usuarioId = GetUsuarioId();

        var tarefa =
            await _tarefaService.GetByIdAsync(id);

        if (tarefa == null)
            return NotFound();

        if (tarefa.UsuarioId != usuarioId)
            return Forbid();

        var atualizado =
            await _tarefaService.UpdateAsync(
                id,
                dto
            );

        if (!atualizado)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var usuarioId = GetUsuarioId();

        var tarefa =
            await _tarefaService.GetByIdAsync(id);

        if (tarefa == null)
            return NotFound();

        if (tarefa.UsuarioId != usuarioId)
            return Forbid();

        var excluido =
            await _tarefaService.DeleteAsync(id);

        if (!excluido)
            return NotFound();

        return NoContent();
    }
}