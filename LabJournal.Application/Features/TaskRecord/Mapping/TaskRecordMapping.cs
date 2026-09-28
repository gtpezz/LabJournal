using AutoMapper;
using LabJournal.Application.Features.TaskRecord.DTOs;

namespace LabJournal.Application.Features.TaskRecord.Mapping;

public class TaskRecordMapping : Profile
{
    public TaskRecordMapping()
    {
        CreateMap<Domain.Entities.TaskRecord, TaskRecordDto>()
            .ForMember(dest => dest.ComputerName, opt => opt.MapFrom(src => src.Computer.Name))
            .ForMember(dest => dest.GroupName, opt => opt.MapFrom(src => src.Group.Name));
    }
}
