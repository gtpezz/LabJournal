using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.Group.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Group.Query.GetGroups;

public class GetGroupsQuery : IRequest<PagedResponse<GroupDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
