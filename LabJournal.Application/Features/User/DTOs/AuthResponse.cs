namespace LabJournal.Application.Features.User.DTOs;

public class AuthResponse
{
    public UserDto User { get; set; } = null!;
    public string Token { get; set; } = null!;
}
