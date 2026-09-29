using LabJournal.Application.Features.User.DTOs;
using MediatR;

namespace LabJournal.Application.Features.User.Query.GetCurrentUser;

public class GetCurrentUserQuery : IRequest<UserDto>
{
    public int Id { get; set; }
}
