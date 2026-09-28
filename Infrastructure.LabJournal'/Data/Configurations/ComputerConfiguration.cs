using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabJournal.Infrastructure.Data.Configurations;

public class ComputerConfiguration : IEntityTypeConfiguration<Computer>
{
    public void Configure(EntityTypeBuilder<Computer> builder)
    {
        builder
            .HasKey(c => c.Id);

        builder
            .HasMany(c => c.TaskRecords)
            .WithOne(tr => tr.Computer)
            .HasForeignKey(tr => tr.ComputerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder
            .HasIndex(c => c.Name)
            .IsUnique();
    }
}
