using AutoMapper;
using AutoMapper.QueryableExtensions;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.Computer.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.Computer.Query.GetComputers;

public class GetComputersQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetComputersQuery, PagedResponse<ComputerDto>>
{

    public async Task<PagedResponse<ComputerDto>> Handle(GetComputersQuery request, CancellationToken cancellationToken)
    {
        var totalCount = await context.Computers.CountAsync(cancellationToken);

        var items = await context.Computers
            .Include(c => c.TaskRecords)
            .AsNoTracking()
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<ComputerDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PagedResponse<ComputerDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
