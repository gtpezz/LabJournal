using AutoMapper;
using LabJournal.Application.Features.Computer.DTOs;

namespace LabJournal.Application.Features.Computer.Mapping;

public class ComputerMapping : Profile
{
    public ComputerMapping() => CreateMap<Domain.Entities.Computer, ComputerDto>();
}
