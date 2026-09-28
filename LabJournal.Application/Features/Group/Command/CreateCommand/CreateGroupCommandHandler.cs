using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.Group.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Group.Command.CreateCommand;

public class CreateGroupCommandHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateGroupCommand, GroupDto>
{
    public async Task<GroupDto> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
    {
        var group = Domain.Entities.Group.CreateGroup(request.Name);

        context.Groups.Add(group);
        await context.SaveChangesAsync(cancellationToken);

        return mapper.Map<GroupDto>(group);
    }
}
