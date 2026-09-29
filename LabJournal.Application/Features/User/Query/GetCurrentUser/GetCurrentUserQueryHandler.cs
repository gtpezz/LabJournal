using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.User.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.User.Query.GetCurrentUser;

public class GetCurrentUserQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetCurrentUserQuery, UserDto>
{
    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Пользователь не найден в системе.");

        return mapper.Map<UserDto>(user);
    }
}
