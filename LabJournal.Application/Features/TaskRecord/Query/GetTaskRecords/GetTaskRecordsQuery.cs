using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.TaskRecord.DTOs;
using MediatR;

namespace LabJournal.Application.Features.TaskRecord.Query.GetTaskRecords;

public class GetTaskRecordsQuery : IRequest<PagedResponse<TaskRecordDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

    public DateOnly? DateFrom { get; set; }
    public DateOnly? DateTo { get; set; }
    public int? GroupId { get; set; }
}
