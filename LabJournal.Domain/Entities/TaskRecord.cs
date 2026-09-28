using LabJournal.Domain.Common;

namespace LabJournal.Domain.Entities;

public class TaskRecord : BaseEntity
{
    public int ComputerId { get; set; }
    public Computer Computer { get; set; } = null!;

    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public DateOnly Date { get; set; }
    public DateTime CreatedAt { get; set; }

    public string TaskDone { get; set; } = string.Empty;

    public string StudentFullName { get; set; } = string.Empty;

    private TaskRecord()
    { }

    public static TaskRecord CreateTaskRecord(int computerId, int groupId, string taskDone, DateOnly date, string studentFullName)
    {
        return new TaskRecord
        {
            ComputerId = computerId,
            GroupId = groupId,
            Date = date,
            TaskDone = taskDone,
            CreatedAt = DateTime.UtcNow,
            StudentFullName = studentFullName
        };
    }

    public void UpdateTaskDone(string newTaskDone, string newStudentFullName)
    {
        if (string.IsNullOrWhiteSpace(newTaskDone))
            throw new ArgumentException("Список заданий не может быть пустым.");

        TaskDone = newTaskDone;
        StudentFullName = newStudentFullName;
    }
}
