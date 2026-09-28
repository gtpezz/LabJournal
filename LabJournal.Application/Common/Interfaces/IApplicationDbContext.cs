using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Computer> Computers { get; set; }
    DbSet<Group> Groups { get; set; }
    DbSet<TaskRecord> TaskRecords { get; set; }
    DbSet<User> Users { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}