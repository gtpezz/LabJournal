using LabJournal.Domain.Common;

namespace LabJournal.Domain.Entities;

public class User : BaseEntity
{
    public string UserName { get; set; } = string.Empty;
    public string HashPassword { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
}
