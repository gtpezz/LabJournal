using LabJournal.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.TaskRecord.Command.UpdateCommand;

public class UpdateTaskRecordCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateTaskRecordCommand, int>
{
    public async Task<int> Handle(UpdateTaskRecordCommand request, CancellationToken cancellationToken)
    {
        var taskRecord = await context.TaskRecords
            .FirstOrDefaultAsync(tr => tr.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Запись в журнале с Id = {request.Id} не найдена.");

        taskRecord.UpdateTaskDone(request.TaskDone, request.StudentFullName);

        await context.SaveChangesAsync(cancellationToken);

        return taskRecord.Id;
    }
}
