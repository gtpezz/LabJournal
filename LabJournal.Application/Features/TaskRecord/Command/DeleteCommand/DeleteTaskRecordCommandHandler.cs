using LabJournal.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.TaskRecord.Command.DeleteCommand;

public class DeleteTaskRecordCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteTaskRecordCommand, int>
{
    public async Task<int> Handle(DeleteTaskRecordCommand request, CancellationToken cancellationToken)
    {
        var taskRecord = await context.TaskRecords
            .FirstOrDefaultAsync(tr => tr.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Запись в журнале с Id = {request.Id} не найдена.");

        context.TaskRecords.Remove(taskRecord);

        await context.SaveChangesAsync(cancellationToken);

        return taskRecord.Id;
    }
}
