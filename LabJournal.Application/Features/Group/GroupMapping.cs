using AutoMapper;
using LabJournal.Application.Features.Group.DTOs;

namespace LabJournal.Application.Features.Group;

public class GroupMapping : Profile
{
    public GroupMapping()
    {
        CreateMap<Domain.Entities.Group, GroupDto>();
    }
}
