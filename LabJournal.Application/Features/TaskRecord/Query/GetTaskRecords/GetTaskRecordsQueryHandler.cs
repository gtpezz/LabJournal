using AutoMapper;
using AutoMapper.QueryableExtensions;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.TaskRecord.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.TaskRecord.Query.GetTaskRecords;

public class GetTaskRecordsQueryHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<GetTaskRecordsQuery, PagedResponse<TaskRecordDto>>
{
    public async Task<PagedResponse<TaskRecordDto>> Handle(GetTaskRecordsQuery request, CancellationToken cancellationToken)
    {
        var query = context.TaskRecords.AsNoTracking();

        if (request.DateFrom.HasValue)
        {
            query = query.Where(tr => tr.Date >= request.DateFrom.Value);
        }

        if (request.DateTo.HasValue)
        {
            query = query.Where(tr => tr.Date <= request.DateTo.Value);
        }

        if (request.GroupId.HasValue)
        {
            query = query.Where(tr => tr.GroupId == request.GroupId.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(tr => tr.Date)
            .ThenByDescending(tr => tr.CreatedAt)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ProjectTo<TaskRecordDto>(mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new PagedResponse<TaskRecordDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}