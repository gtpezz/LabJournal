using LabJournal.Domain.Common;

namespace LabJournal.Domain.Entities;

public class Computer : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public ICollection<TaskRecord> TaskRecords { get; set; } = [];

    private Computer()
    { }

    public static Computer CreateComputer(string name)
    {
        return new Computer
        {
            Name = name
        };
    }
}
