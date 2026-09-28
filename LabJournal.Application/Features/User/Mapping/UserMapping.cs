using AutoMapper;
using LabJournal.Application.Features.User.DTOs;

namespace LabJournal.Application.Features.User.Mapping;

public class UserMapping : Profile
{
    public UserMapping()
    {
        CreateMap<Domain.Entities.User, UserDto>();
    }
}
