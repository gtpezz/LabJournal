using LabJournal.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.TaskRecord.Command.CreateCommand;

public class CreateTaskRecordCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateTaskRecordCommand, int>
{
    public async Task<int> Handle(CreateTaskRecordCommand request, CancellationToken cancellationToken)
    {
        var computerExists = await context.Computers.AnyAsync(c => c.Id == request.ComputerId, cancellationToken);
        if (!computerExists)
            throw new KeyNotFoundException($"Компьютер с Id = {request.ComputerId} не найден.");

        var groupExists = await context.Groups.AnyAsync(g => g.Id == request.GroupId, cancellationToken);
        if (!groupExists)
            throw new KeyNotFoundException($"Группа с Id = {request.GroupId} не найдена.");

        if (string.IsNullOrWhiteSpace(request.TaskDone))
            throw new ArgumentException("Список выполненных заданий не может быть пустым.");

        var taskRecord = Domain.Entities.TaskRecord.CreateTaskRecord(
            request.ComputerId,
            request.GroupId,
            request.TaskDone,
            request.Date,
            request.StudentFullName
        );

        context.TaskRecords.Add(taskRecord);
        await context.SaveChangesAsync(cancellationToken);

        return taskRecord.Id;
    }
}