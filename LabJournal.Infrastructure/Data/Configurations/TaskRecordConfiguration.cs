using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabJournal.Infrastructure.Data.Configurations;

public class TaskRecordConfiguration : IEntityTypeConfiguration<TaskRecord>
{
    public void Configure(EntityTypeBuilder<TaskRecord> builder)
    {
        builder
           .HasKey(tr => tr.Id);

        builder
            .Property(tr => tr.TaskDone)
            .IsRequired()
            .HasMaxLength(200);

        builder
            .Property(tr => tr.Date)
            .IsRequired()
            .HasColumnType("date");

        builder
            .Property(tr => tr.CreatedAt)
            .IsRequired();

        builder
            .Property(tr => tr.StudentFullName)
            .IsRequired()
            .HasMaxLength(300);
    }
}
