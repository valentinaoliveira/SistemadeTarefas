using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaTarefas.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarDataVencimentoTarefa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataVencimento",
                table: "Tarefas",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataVencimento",
                table: "Tarefas");
        }
    }
}
