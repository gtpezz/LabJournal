using LabJournal.Application.Features.User.DTOs;
using MediatR;

namespace LabJournal.Application.Features.User.Auth.Register;

public class RegisterUserCommand : IRequest<AuthResponse>
{
    public string UserName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = "User";
}
