using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.Computer.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.Computer.Commands.CreateCommand;

public class CreateComputerCommandHandler(IApplicationDbContext context, IMapper mapper)
    : IRequestHandler<CreateComputerCommand, ComputerDto>
{
    public async Task<ComputerDto> Handle(CreateComputerCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Название ПК не может быть пустым.");

        var groupExists = await context.Groups
            .AnyAsync(g => g.Id == request.GroupId, cancellationToken);
        if (!groupExists)
            throw new KeyNotFoundException($"Группа с Id = {request.GroupId} не найдена.");

        var duplicate = await context.Computers
            .AnyAsync(c => c.GroupId == request.GroupId && c.Name == request.Name, cancellationToken);
        if (duplicate)
            throw new InvalidOperationException(
                $"В группе уже есть компьютер с именем «{request.Name}».");

        var computer = Domain.Entities.Computer.CreateComputer(request.Name, request.GroupId);
        context.Computers.Add(computer);

        await context.SaveChangesAsync(cancellationToken);
        return mapper.Map<ComputerDto>(computer);
    }
}
