using LabJournal.Application.Features.Computer.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Computer.Commands.CreateCommand;

public class CreateComputerCommand : IRequest<ComputerDto>
{
    public string Name { get; set; } = string.Empty;
}
