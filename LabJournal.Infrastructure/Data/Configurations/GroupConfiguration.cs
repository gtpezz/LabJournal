using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabJournal.Infrastructure.Data.Configurations;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder
            .HasKey(g => g.Id);

        builder
            .HasMany(g => g.TaskRecords)
            .WithOne(tr => tr.Group)
            .HasForeignKey(tr => tr.GroupId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder
            .HasIndex(g => g.Name)
            .IsUnique();
    }
}
