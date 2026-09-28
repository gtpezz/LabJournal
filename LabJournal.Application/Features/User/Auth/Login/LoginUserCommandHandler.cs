using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.User.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.User.Auth.Login;

public class LoginUserCommandHandler(
    IApplicationDbContext context,
    IMapper mapper,
    IJwtTokenGenerator jwtTokenGenerator,
    IPasswordHasher passwordHasher)
    : IRequestHandler<LoginUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(LoginUserCommand request, CancellationToken cancellationToken)
    {
        var user = await context.Users
             .FirstOrDefaultAsync(u => u.UserName == request.Login, cancellationToken)
             ?? throw new ArgumentException("Неверный логин или пароль");

        if (!passwordHasher.Verify(user.HashPassword, request.Password))
            throw new ArgumentException("Неверный логин или пароль");

        var token = jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            User = mapper.Map<UserDto>(user),
            Token = token
        };
    }
}
