using MediatR;

namespace LabJournal.Application.Features.Computer.Commands.DeleteComputer;

public class DeleteComputerCommand : IRequest<int>
{
    public int Id { get; set; }
}
