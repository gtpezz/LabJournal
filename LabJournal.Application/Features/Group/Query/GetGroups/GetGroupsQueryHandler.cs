using AutoMapper;
using AutoMapper.QueryableExtensions;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.Group.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.Group.Query.GetGroups;

public class GetGroupsQueryHandler(IApplicationDbContext context, IMapper mapper) : IRequestHandler<GetGroupsQuery, PagedResponse<GroupDto>>
{
    public async Task<PagedResponse<GroupDto>> Handle(GetGroupsQuery request, CancellationToken cancellationToken)
    {
        var total = await context.Groups.CountAsync(cancellationToken);

        var items = await context.Groups
            .AsNoTracking()
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<GroupDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PagedResponse<GroupDto>(items, total, request.PageNumber, request.PageSize);
    }
}
