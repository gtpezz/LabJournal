using MediatR;

namespace LabJournal.Application.Features.TaskRecord.Command.DeleteCommand;

public class DeleteTaskRecordCommand : IRequest<int>
{
    public int Id { get; set; }
}
