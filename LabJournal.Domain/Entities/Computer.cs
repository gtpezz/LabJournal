using LabJournal.Domain.Common;

namespace LabJournal.Domain.Entities;

public class Computer : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;

    public ICollection<TaskRecord> TaskRecords { get; set; } = [];

    private Computer()
    { }

    public static Computer CreateComputer(string name, int groupId)
    {
        return new Computer
        {
            Name = name,
            GroupId = groupId
        };
    }
}
