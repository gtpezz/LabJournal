using MediatR;

namespace LabJournal.Application.Features.Group.Command.DeleteCommand;

public class DeleteGroupCommand : IRequest<int>
{
    public int Id { get; set; }
}
