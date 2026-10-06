using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Security.Claims;

using SistemaTarefas.Application.Interfaces;
using SistemaTarefas.Application.Services;
using SistemaTarefas.Infrastructure.Data;
using SistemaTarefas.Infrastructure.Repositories;
using SistemaTarefas.Infrastructure.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// CONTROLLERS
// ======================================================

builder.Services.AddControllers();


// ======================================================
// CORS
// Permite que o React acesse a API
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Frontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});


// ======================================================
// BANCO DE DADOS
// ======================================================

builder.Services.AddDbContext<AppDbContext>(
    options =>
        options.UseSqlite(
            builder.Configuration
                .GetConnectionString(
                    "DefaultConnection"
                )
        )
);


// ======================================================
// REPOSITORIES
// ======================================================

builder.Services.AddScoped<
    IUsuarioRepository,
    UsuarioRepository
>();

builder.Services.AddScoped<
    ITarefaRepository,
    TarefaRepository
>();


// ======================================================
// SERVICES
// ======================================================

builder.Services.AddScoped<
    IUsuarioService,
    UsuarioService
>();

builder.Services.AddScoped<
    ITarefaService,
    TarefaService
>();

builder.Services.AddScoped<
    IAuthService,
    AuthService
>();


// ======================================================
// JWT
// ======================================================

var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "Chave JWT não configurada."
    );

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration[
                        "Jwt:Issuer"
                    ],

                ValidAudience =
                    builder.Configuration[
                        "Jwt:Audience"
                    ],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtKey
                        )
                    )
            };

        options.Events =
            new JwtBearerEvents
            {
                OnTokenValidated =
                    async context =>
                    {
                        var usuarioIdTexto =
                            context.Principal?
                                .FindFirstValue(
                                    ClaimTypes
                                        .NameIdentifier
                                );

                        if (
                            !int.TryParse(
                                usuarioIdTexto,
                                out var usuarioId
                            )
                        )
                        {
                            context.Fail(
                                "Token inválido."
                            );

                            return;
                        }

                        var repository =
                            context.HttpContext
                                .RequestServices
                                .GetRequiredService<
                                    IUsuarioRepository
                                >();

                        var usuario =
                            await repository
                                .GetByIdAsync(
                                    usuarioId
                                );

                        if (usuario == null)
                        {
                            context.Fail(
                                "Usuário não existe mais."
                            );

                            return;
                        }

                        var identity =
                            context.Principal?
                                .Identity
                                as ClaimsIdentity;

                        if (identity == null)
                        {
                            context.Fail(
                                "Identidade inválida."
                            );

                            return;
                        }

                        var roleAntiga =
                            identity.FindFirst(
                                ClaimTypes.Role
                            );

                        if (roleAntiga != null)
                        {
                            identity.RemoveClaim(
                                roleAntiga
                            );
                        }

                        identity.AddClaim(
                            new Claim(
                                ClaimTypes.Role,
                                usuario.Role
                                    .ToString()
                            )
                        );
                    }
            };
    });

builder.Services.AddAuthorization();


// ======================================================
// SWAGGER
// ======================================================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Type =
                SecuritySchemeType.Http,

            Scheme = "bearer",

            BearerFormat = "JWT",

            Description =
                "Digite o token JWT"
        }
    );

    options.AddSecurityRequirement(
        document =>
            new OpenApiSecurityRequirement
            {
                [
                    new OpenApiSecuritySchemeReference(
                        "Bearer",
                        document
                    )
                ] = []
            }
    );
});


// ======================================================
// CRIA A APLICAÇÃO
// ======================================================

var app = builder.Build();


// ======================================================
// SWAGGER
// ======================================================

app.UseSwagger();
app.UseSwaggerUI();


// ======================================================
// CORS
// IMPORTANTE: antes de Authentication/Authorization
// ======================================================

app.UseCors("Frontend");


// ======================================================
// HTTPS
// ======================================================

// Estamos usando HTTP durante o desenvolvimento.
// Isso também evita o aviso:
// "Failed to determine the https port for redirect."

// app.UseHttpsRedirection();


// ======================================================
// AUTENTICAÇÃO
// ======================================================

app.UseAuthentication();

app.UseAuthorization();


// ======================================================
// CONTROLLERS
// ======================================================

app.MapControllers();


// ======================================================
// INICIA API
// ======================================================

app.Run();