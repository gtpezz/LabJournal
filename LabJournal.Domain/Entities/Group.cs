using LabJournal.Domain.Common;

namespace LabJournal.Domain.Entities;

public class Group : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public ICollection<TaskRecord> TaskRecords { get; set; } = [];
    public ICollection<Computer> Computers { get; set; } = [];

    private Group()
    { }

    public static Group CreateGroup(string name)
    {
        return new Group
        {
            Name = name
        };
    }
}
