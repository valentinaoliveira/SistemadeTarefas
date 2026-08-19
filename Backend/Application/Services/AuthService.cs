using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SistemaTarefas.Application.DTOs.Auth;
using SistemaTarefas.Application.Interfaces;
using SistemaTarefas.Domain.Entities;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

namespace SistemaTarefas.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IConfiguration _configuration;

    public AuthService(
        IUsuarioRepository usuarioRepository,
        IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
    {
        var usuario =
            await _usuarioRepository.GetByEmailAsync(dto.Email);

        if (usuario == null)
            return null;

        var senhaValida =
            BCrypt.Net.BCrypt.Verify(
                dto.Senha,
                usuario.PasswordHash
            );

        if (!senhaValida)
            return null;

        var token = GerarToken(usuario);

        return new LoginResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Role = usuario.Role.ToString()
        };
    }

    private string GerarToken(Usuario usuario)
    {
        var jwtKey =
            _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "Chave JWT não configurada."
            );

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                usuario.Nome
            ),

            new Claim(
                ClaimTypes.Email,
                usuario.Email
            ),

            new Claim(
                ClaimTypes.Role,
                usuario.Role.ToString()
            )
        };

        var chave =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            );

        var credenciais =
            new SigningCredentials(
                chave,
                SecurityAlgorithms.HmacSha256
            );

        var token =
            new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credenciais
            );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}