using MediatR;

namespace LabJournal.Application.Features.TaskRecord.Query.ExportTaskRecords;

public class ExportTaskRecordsToExcelQuery : IRequest<byte[]>
{
    public DateOnly? DateFrom { get; set; }
    public DateOnly? DateTo { get; set; }
    public int? GroupId { get; set; }
}
