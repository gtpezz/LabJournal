using LabJournal.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.Group.Command.DeleteCommand;

public class DeleteGroupCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteGroupCommand, int>
{
    public async Task<int> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
    {
        var group = await context
            .Groups
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Group with Id = {request.Id} not found");

        context.Groups.Remove(group);
        await context.SaveChangesAsync(cancellationToken);

        return group.Id;
    }
}
