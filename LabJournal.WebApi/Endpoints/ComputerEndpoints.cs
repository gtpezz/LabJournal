using LabJournal.Application.Features.Computer.Commands.CreateCommand;
using LabJournal.Application.Features.Computer.Commands.DeleteComputer;
using LabJournal.Application.Features.Computer.Query.GetComputers;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace LabJournal.WebApi.Endpoints;

public class ComputerEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/computers").WithTags("Computers");

        group.MapGet("/", async (int? pageSize, int? pageNumber, ISender sender, CancellationToken ct) =>
        {
            var items = await sender.Send(new GetComputersQuery
            {
                PageNumber = pageNumber ?? 1,
                PageSize = pageSize ?? 10,
            }, ct);

            return Results.Ok(items);
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
