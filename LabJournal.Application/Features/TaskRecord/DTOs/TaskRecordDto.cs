namespace LabJournal.Application.Features.TaskRecord.DTOs;

public class TaskRecordDto
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }

    public string ComputerName { get; set; } = string.Empty;
    public string GroupName { get; set; } = string.Empty;
    public string StudentFullName { get; set; } = string.Empty;
    

    public string TaskDone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}