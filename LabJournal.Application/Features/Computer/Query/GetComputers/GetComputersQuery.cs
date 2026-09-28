using LabJournal.Application.Common.Pagging;
using LabJournal.Application.Features.Computer.DTOs;
using MediatR;

namespace LabJournal.Application.Features.Computer.Query.GetComputers;

public class GetComputersQuery : IRequest<PagedResponse<ComputerDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
