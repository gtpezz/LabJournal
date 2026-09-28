using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.Group.Command.CreateCommand;
using LabJournal.Application.Features.Group.Command.DeleteCommand;
using LabJournal.Application.Features.Group.DTOs;
using LabJournal.Application.Features.Group.Query.GetGroups;
using MediatR;

namespace LabJournal.WebApi.Endpoints;

public class GroupEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/groups").WithTags("Groups");

        group.MapGet("/", async (int? pageSize, int? pageNumber, ISender sender, CancellationToken ct) =>
        {
            var query = new GetGroupsQuery
            {
                PageNumber = pageNumber ?? 1,
                PageSize = pageSize ?? 10
            };

            var items = await sender.Send(query, ct);
            return Results.Ok(items);
        })
        .WithName("GetGroups")
        .Produces<PagedResponse<GroupDto>>(StatusCodes.Status200OK);

        group.MapPost("/", async (CreateGroupCommand command, ISender sender, CancellationToken ct) =>
        {
            var groupId = await sender.Send(command, ct);

            return Results.Created($"/api/groups/{groupId}", groupId);
        })
        .WithName("CreateGroup")
        .Produces<int>(StatusCodes.Status201Created);

        group.MapDelete("/{id:int}", async (int id, ISender sender, CancellationToken ct) =>
        {
            var groupId = await sender.Send(new DeleteGroupCommand { Id = id }, ct);

            return Results.NoContent();
        })
        .WithName("DeleteGroup")
        .Produces(StatusCodes.Status204NoContent);
    }
}
