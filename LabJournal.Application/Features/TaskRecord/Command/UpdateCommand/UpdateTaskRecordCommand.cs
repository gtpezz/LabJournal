using MediatR;

namespace LabJournal.Application.Features.TaskRecord.Command.UpdateCommand;

public class UpdateTaskRecordCommand : IRequest<int>
{
    public int Id { get; set; }
    public string TaskDone { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;
}
