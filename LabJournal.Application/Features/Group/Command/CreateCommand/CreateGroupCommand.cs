using LabJournal.Application.Features.Group.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Group.Command.CreateCommand;

public class CreateGroupCommand : IRequest<GroupDto>
{
    public string Name { get; set; } = string.Empty;
}
