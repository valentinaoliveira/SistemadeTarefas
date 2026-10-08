using SistemaTarefas.Application.DTOs.Usuario;
using SistemaTarefas.Application.Interfaces;
using SistemaTarefas.Domain.Entities;
using SistemaTarefas.Domain.Enums;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

namespace SistemaTarefas.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _repository;

    public UsuarioService(
        IUsuarioRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<UsuarioResponseDto>>
        GetAllAsync()
    {
        var usuarios =
            await _repository.GetAllAsync();

        return usuarios
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<UsuarioResponseDto?>
        GetByIdAsync(int id)
    {
        var usuario =
            await _repository.GetByIdAsync(id);

        if (usuario == null)
            return null;

        return MapToResponse(usuario);
    }

    public async Task<UsuarioResponseDto>
        CreateAsync(
            CriarUsuarioDto dto)
    {
        var email =
            dto.Email
                .Trim()
                .ToLowerInvariant();

        var emailExiste =
            await _repository
                .GetByEmailAsync(email);

        if (emailExiste != null)
        {
            throw new InvalidOperationException(
                "Já existe um usuário com este e-mail."
            );
        }

        var usuario = new Usuario
        {
            Nome = dto.Nome.Trim(),

            Email = email,

            PasswordHash =
                BCrypt.Net.BCrypt
                    .HashPassword(
                        dto.Senha
                    ),

            Role = UserRole.User
        };

        var usuarioCriado =
            await _repository
                .AddAsync(usuario);

        return MapToResponse(
            usuarioCriado
        );
    }

    public async Task<bool>
        UpdateAsync(
            int id,
            AtualizarUsuarioDto dto)
    {
        var usuario =
            await _repository
                .GetByIdAsync(id);

        if (usuario == null)
            return false;

        var email =
            dto.Email
                .Trim()
                .ToLowerInvariant();

        var emailExistente =
            await _repository
                .GetByEmailAsync(email);

        if (
            emailExistente != null &&
            emailExistente.Id != id
        )
        {
            throw new InvalidOperationException(
                "Este e-mail já está sendo utilizado."
            );
        }

        usuario.Nome =
            dto.Nome.Trim();

        usuario.Email =
            email;

        await _repository
            .UpdateAsync(usuario);

        return true;
    }

    public async Task<bool>
        AlterarRoleAsync(
            int id,
            UserRole role)
    {
        var usuario =
            await _repository
                .GetByIdAsync(id);

        if (usuario == null)
            return false;

        if (
            !Enum.IsDefined(
                typeof(UserRole),
                role
            )
        )
        {
            throw new InvalidOperationException(
                "Perfil de usuário inválido."
            );
        }

        usuario.Role = role;

        await _repository
            .UpdateAsync(usuario);

        return true;
    }

    public async Task<bool>
        AlterarSenhaAsync(
            int id,
            AlterarSenhaUsuarioDto dto)
    {
        var usuario =
            await _repository
                .GetByIdAsync(id);

        if (usuario == null)
            return false;

        if (
            string.IsNullOrWhiteSpace(
                dto.SenhaAtual
            ) ||
            string.IsNullOrWhiteSpace(
                dto.NovaSenha
            ) ||
            string.IsNullOrWhiteSpace(
                dto.ConfirmarNovaSenha
            )
        )
        {
            throw new InvalidOperationException(
                "Preencha todos os campos de senha."
            );
        }

        var senhaAtualCorreta =
            BCrypt.Net.BCrypt.Verify(
                dto.SenhaAtual,
                usuario.PasswordHash
            );

        if (!senhaAtualCorreta)
        {
            throw new InvalidOperationException(
                "A senha atual está incorreta."
            );
        }

        if (
            dto.NovaSenha.Length < 6
        )
        {
            throw new InvalidOperationException(
                "A nova senha deve possuir pelo menos 6 caracteres."
            );
        }

        if (
            dto.NovaSenha !=
            dto.ConfirmarNovaSenha
        )
        {
            throw new InvalidOperationException(
                "A nova senha e a confirmação não são iguais."
            );
        }

        var mesmaSenha =
            BCrypt.Net.BCrypt.Verify(
                dto.NovaSenha,
                usuario.PasswordHash
            );

        if (mesmaSenha)
        {
            throw new InvalidOperationException(
                "A nova senha deve ser diferente da senha atual."
            );
        }

        usuario.PasswordHash =
            BCrypt.Net.BCrypt
                .HashPassword(
                    dto.NovaSenha
                );

        await _repository
            .UpdateAsync(usuario);

        return true;
    }

    public async Task<bool>
        DeleteAsync(int id)
    {
        var usuario =
            await _repository
                .GetByIdAsync(id);

        if (usuario == null)
            return false;

        await _repository
            .DeleteAsync(usuario);

        return true;
    }

    private static UsuarioResponseDto
        MapToResponse(
            Usuario usuario)
    {
        return new UsuarioResponseDto
        {
            Id = usuario.Id,

            Nome = usuario.Nome,

            Email = usuario.Email,

            Role = usuario.Role,

            DataCriacao =
                usuario.DataCriacao
        };
    }
}