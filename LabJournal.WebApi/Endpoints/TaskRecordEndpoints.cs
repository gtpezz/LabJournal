using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.TaskRecord.Command.CreateCommand;
using LabJournal.Application.Features.TaskRecord.Command.DeleteCommand;
using LabJournal.Application.Features.TaskRecord.Command.UpdateCommand;
using LabJournal.Application.Features.TaskRecord.DTOs;
using LabJournal.Application.Features.TaskRecord.Query.ExportTaskRecords;
using LabJournal.Application.Features.TaskRecord.Query.GetTaskRecords;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LabJournal.WebApi.Endpoints;

public class TaskRecordEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/task-records").WithTags("TaskRecords");

        group.MapGet("/", async (
            [FromQuery] int? pageSize,
            [FromQuery] int? pageNumber,
            [FromQuery] DateOnly? dateFrom,
            [FromQuery] DateOnly? dateTo,
            [FromQuery] int? groupId,
            ISender sender,
            CancellationToken ct) =>
        {
            var query = new GetTaskRecordsQuery
            {
                PageNumber = pageNumber ?? 1,
                PageSize = pageSize ?? 10,
                DateFrom = dateFrom,
                DateTo = dateTo,
                GroupId = groupId
            };

            var result = await sender.Send(query, ct);
            return Results.Ok(result);
        })
        .WithName("GetTaskRecords")
        .Produces<PagedResponse<TaskRecordDto>>(StatusCodes.Status200OK);

        group.MapPost("/", async (CreateTaskRecordCommand command, ISender sender, CancellationToken ct) =>
        {
            var recordId = await sender.Send(command, ct);
            return Results.Created($"/api/task-records/{recordId}", recordId);
        })
        .WithName("CreateTaskRecord")
        .Produces<int>(StatusCodes.Status201Created);

        group.MapPut("/", async (UpdateTaskRecordCommand command, ISender sender, CancellationToken ct) =>
        {
            var recordId = await sender.Send(command, ct);
            return Results.Ok(recordId);
        })
        .WithName("UpdateTaskRecord")
        .Produces<int>(StatusCodes.Status200OK);

        group.MapDelete("/{id:int}", async (int id, ISender sender, CancellationToken ct) =>
        {
            var recordId = await sender.Send(new DeleteTaskRecordCommand { Id = id }, ct);
            return Results.NoContent();
        })
        .WithName("DeleteTaskRecord")
        .Produces(StatusCodes.Status204NoContent);

        group.MapGet("/export", async (
            [FromQuery] DateOnly? dateFrom,
            [FromQuery] DateOnly? dateTo,
            [FromQuery] int? groupId,
            ISender sender,
            CancellationToken ct) =>
        {
            var query = new ExportTaskRecordsToExcelQuery
            {
                DateFrom = dateFrom,
                DateTo = dateTo,
                GroupId = groupId
            };

            var fileBytes = await sender.Send(query, ct);
            var fileName = $"LabJournal_Report_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return Results.File(
                fileBytes,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileDownloadName: fileName
            );
        })
        .WithName("ExportTaskRecordsToExcel")
        .Produces(StatusCodes.Status200OK, contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
}
