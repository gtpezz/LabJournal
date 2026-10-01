using LabJournal.Application.Common.Interfaces;
using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Computer> Computers { get; set; }
    public DbSet<TaskRecord> TaskRecords { get; set; }

    public ApplicationDbContext(DbContextOptions options) : base(options)
    { }

    protected ApplicationDbContext()
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
