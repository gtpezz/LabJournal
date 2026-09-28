using MediatR;

namespace LabJournal.Application.Features.TaskRecord.Command.CreateCommand;

public class CreateTaskRecordCommand : IRequest<int>
{
    public int ComputerId { get; set; }
    public int GroupId { get; set; }
    public DateOnly Date { get; set; }
    public string TaskDone { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;

}
