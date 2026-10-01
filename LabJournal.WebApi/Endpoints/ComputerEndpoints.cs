using LabJournal.Application.Features.Computer.Commands.CreateCommand;
using LabJournal.Application.Features.Computer.Commands.DeleteComputer;
using LabJournal.Application.Features.Computer.Query.GetComputers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LabJournal.WebApi.Endpoints;

public class ComputerEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/computers").WithTags("Computers");

        group.MapGet("/", async (
            [FromQuery] int? pageSize,
            [FromQuery] int? pageNumber,
            [FromQuery] int? groupId,
            ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetComputersQuery
            {
                PageNumber = pageNumber ?? 1,
                PageSize = pageSize ?? 10,
                GroupId = groupId,
            }, ct);
            return Results.Ok(result);
        });

        group.MapPost("/", async (CreateComputerCommand command, ISender sender, CancellationToken ct) =>
        {
            var computer = await sender.Send(command, ct);

            return Results.Created($"/api/computers/{computer}", computer);
        });

        group.MapDelete("/{id:int}", async (int id, ISender sender, CancellationToken ct) =>
        {
            var computer = await sender.Send(new DeleteComputerCommand { Id = id }, ct);

            return Results.NoContent();
        });
    }
}
