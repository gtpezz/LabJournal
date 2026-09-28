using LabJournal.Application.Features.User.DTOs;
using MediatR;

namespace LabJournal.Application.Features.User.Auth.Login;

public class LoginUserCommand : IRequest<AuthResponse>
{
    public string Login { get; set; } = null!;
    public string Password { get; set; } = null!;
}
