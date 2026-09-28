using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.Computer.Commands.DeleteComputer;

public class DeleteComputerCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteComputerCommand, int>
{
    public async Task<int> Handle(DeleteComputerCommand request, CancellationToken cancellationToken)
    {
        var computer = await context.Computers.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Computer with Id = {request.Id} not found");

        context.Computers.Remove(computer);
        await context.SaveChangesAsync(cancellationToken);

        return computer.Id;
    }
}
