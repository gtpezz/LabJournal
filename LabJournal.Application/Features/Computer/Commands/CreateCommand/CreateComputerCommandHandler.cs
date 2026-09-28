using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.Computer.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Computer.Commands.CreateCommand;

public class CreateComputerCommandHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateComputerCommand, ComputerDto>
{
    public async Task<ComputerDto> Handle(CreateComputerCommand request, CancellationToken cancellationToken)
    {
        var computer = Domain.Entities.Computer.CreateComputer(request.Name);

        context.Computers.Add(computer);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<ComputerDto>(computer);
    }
}
