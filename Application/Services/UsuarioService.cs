using SistemaTarefas.Application.DTOs.Usuario;
using SistemaTarefas.Application.Interfaces;
using SistemaTarefas.Domain.Entities;
using SistemaTarefas.Domain.Enums;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

namespace SistemaTarefas.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;

    public UsuarioService(IUsuarioRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<UsuarioResponseDto>> GetAllAsync()
    {
        var usuarios = await _repository.GetAllAsync();

        return usuarios.Select(MapToResponse).ToList();
    }

    public async Task<UsuarioResponseDto?> GetByIdAsync(int id)
    {
        var usuario = await _repository.GetByIdAsync(id);

        if (usuario == null)
            return null;

        return MapToResponse(usuario);
    }

    public async Task<UsuarioResponseDto> CreateAsync(
        CriarUsuarioDto dto)
    {
        var emailExiste = await _repository.GetByEmailAsync(dto.Email);

        if (emailExiste != null)
            throw new InvalidOperationException(
                "Já existe um usuário com este e-mail."
            );

        var usuario = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Role = UserRole.User
        };

        var usuarioCriado = await _repository.AddAsync(usuario);

        return MapToResponse(usuarioCriado);
    }

    public async Task<bool> UpdateAsync(
        int id,
        AtualizarUsuarioDto dto)
    {
        var usuario = await _repository.GetByIdAsync(id);

        if (usuario == null)
            return false;

        var emailExistente =
            await _repository.GetByEmailAsync(dto.Email);

        if (emailExistente != null &&
            emailExistente.Id != id)
        {
            throw new InvalidOperationException(
                "Este e-mail já está sendo utilizado."
            );
        }

        usuario.Nome = dto.Nome;
        usuario.Email = dto.Email;

        await _repository.UpdateAsync(usuario);

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var usuario = await _repository.GetByIdAsync(id);

        if (usuario == null)
            return false;

        await _repository.DeleteAsync(usuario);

        return true;
    }

    private static UsuarioResponseDto MapToResponse(
        Usuario usuario)
    {
        return new UsuarioResponseDto
        {
            Id = usuario.Id,
            Nome = usuario.Nome,
            Email = usuario.Email,
            Role = usuario.Role,
            DataCriacao = usuario.DataCriacao
        };
    }
}