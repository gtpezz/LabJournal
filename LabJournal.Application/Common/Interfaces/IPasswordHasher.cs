namespace LabJournal.Application.Common.Interfaces;

public interface IPasswordHasher
{
    string HashPassword(string password);
    bool Verify(string hashPassword, string password);
}
