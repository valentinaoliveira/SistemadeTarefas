using Microsoft.AspNetCore.Mvc;
using SistemaTarefas.Application.DTOs.Auth;
using SistemaTarefas.Application.Interfaces;

namespace SistemaTarefas.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginDto dto)
    {
        var resultado =
            await _authService.LoginAsync(dto);

        if (resultado == null)
        {
            return Unauthorized(new
            {
                mensagem = "E-mail ou senha inválidos."
            });
        }

        return Ok(resultado);
    }
}