using LabJournal.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LabJournal.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder
            .HasKey(u => u.Id);

        builder
            .Property(u => u.UserName)
            .IsRequired()
            .HasMaxLength(100);

        builder
            .Property(u => u.HashPassword)
            .IsRequired()
            .HasMaxLength(300);

        builder
            .Property(u => u.Role)
            .IsRequired()
            .HasMaxLength(25)
            .HasDefaultValue("User");

        builder
            .HasIndex(u => u.UserName)
            .IsUnique();
    }
}
