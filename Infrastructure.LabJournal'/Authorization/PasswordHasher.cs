using LabJournal.Application.Common.Interfaces;

namespace LabJournal.Infrastructure.Authorization;

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
        => BCrypt.Net.BCrypt.EnhancedHashPassword(password);

    public bool Verify(string hashPassword, string password)
        => BCrypt.Net.BCrypt.EnhancedVerify(password, hashPassword);
}
