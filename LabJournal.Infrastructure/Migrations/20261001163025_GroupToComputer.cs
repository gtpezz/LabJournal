using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabJournal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class GroupToComputer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Удаляем старый уникальный индекс по Name
            migrationBuilder.DropIndex(
                name: "IX_Computers_Name",
                table: "Computers");

            // 2. Добавляем GroupId как NULLABLE (чтобы заполнить существующие строки)
            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "Computers",
                type: "int",
                nullable: true);

            // 3. Привязываем существующие ПК к первой группе (если есть)
            migrationBuilder.Sql(@"
        IF EXISTS (SELECT 1 FROM Groups)
        BEGIN
            DECLARE @firstGroupId INT = (SELECT TOP 1 Id FROM Groups ORDER BY Id);
            UPDATE Computers SET GroupId = @firstGroupId WHERE GroupId IS NULL;
        END
    ");

            // 4. Делаем GroupId NOT NULL
            migrationBuilder.AlterColumn<int>(
                name: "GroupId",
                table: "Computers",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            // 5. Составной уникальный индекс
            migrationBuilder.CreateIndex(
                name: "IX_Computers_GroupId_Name",
                table: "Computers",
                columns: new[] { "GroupId", "Name" },
                unique: true);

            // 6. FK на Groups
            migrationBuilder.AddForeignKey(
                name: "FK_Computers_Groups_GroupId",
                table: "Computers",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Computers_Groups_GroupId",
                table: "Computers");

            migrationBuilder.DropIndex(
                name: "IX_Computers_GroupId_Name",
                table: "Computers");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "Computers");

            migrationBuilder.CreateIndex(
                name: "IX_Computers_Name",
                table: "Computers",
                column: "Name",
                unique: true);
        }
    }
}
