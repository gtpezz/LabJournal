namespace LabJournal.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(Domain.Entities.User user);
}
