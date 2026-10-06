using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTarefas.Application.DTOs.Usuario;
using SistemaTarefas.Application.Interfaces;

namespace SistemaTarefas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(
        IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    private int GetUsuarioId()
    {
        var id = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (string.IsNullOrEmpty(id))
        {
            throw new UnauthorizedAccessException();
        }

        return int.Parse(id);
    }

    private bool UsuarioEhAdmin()
    {
        return User.IsInRole("Admin");
    }

    // Cadastro público
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Criar(
        [FromBody] CriarUsuarioDto dto)
    {
        try
        {
            var usuario =
                await _usuarioService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = usuario.Id },
                usuario
            );
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                mensagem = ex.Message
            });
        }
    }

    // Usuário pode consultar a si mesmo.
    // Admin pode consultar qualquer usuário.
    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuarioLogadoId = GetUsuarioId();

        if (!UsuarioEhAdmin() &&
            usuarioLogadoId != id)
        {
            return Forbid();
        }

        var usuario =
            await _usuarioService.GetByIdAsync(id);

        if (usuario == null)
        {
            return NotFound();
        }

        return Ok(usuario);
    }

    // Somente Admin lista todos os usuários.
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios =
            await _usuarioService.GetAllAsync();

        return Ok(usuarios);
    }

    // Usuário pode alterar a si mesmo.
    // Admin pode alterar qualquer usuário.
    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(
        int id,
        [FromBody] AtualizarUsuarioDto dto)
    {
        var usuarioLogadoId = GetUsuarioId();

        if (!UsuarioEhAdmin() &&
            usuarioLogadoId != id)
        {
            return Forbid();
        }

        try
        {
            var atualizado =
                await _usuarioService.UpdateAsync(
                    id,
                    dto
                );

            if (!atualizado)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                mensagem = ex.Message
            });
        }
    }
[Authorize(Roles = "Admin")]
[HttpPatch("{id:int}/role")]
public async Task<IActionResult> AlterarRole(
    int id,
    [FromBody] AlterarRoleUsuarioDto dto)
{
    var usuarioLogadoId = GetUsuarioId();

    if (usuarioLogadoId == id)
    {
        return BadRequest(new
        {
            mensagem =
                "Você não pode alterar o perfil da sua própria conta."
        });
    }

    try
    {
        var atualizado =
            await _usuarioService
                .AlterarRoleAsync(
                    id,
                    dto.Role
                );

        if (!atualizado)
        {
            return NotFound();
        }

        return NoContent();
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(new
        {
            mensagem = ex.Message
        });
    }
}
    // Somente Admin pode excluir usuários.
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    
    public async Task<IActionResult> Excluir(int id)
    {
        var usuarioLogadoId = GetUsuarioId();

        // Evita que o Admin exclua a própria conta
        // enquanto está utilizando o sistema.
        if (usuarioLogadoId == id)
        {
            return BadRequest(new
            {
                mensagem =
                    "Você não pode excluir sua própria conta."
            });
        }

        var excluido =
            await _usuarioService.DeleteAsync(id);

        if (!excluido)
        {
            return NotFound();
        }

        return NoContent();
    }
}