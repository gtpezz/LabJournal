using AutoMapper;
using LabJournal.Application.Common.Interfaces;
using LabJournal.Application.Features.User.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LabJournal.Application.Features.User.Auth.Register;

public class RegisterUserCommandHandler(IApplicationDbContext context, IMapper mapper, IPasswordHasher passwordHasher, IJwtTokenGenerator jwtTokenGenerator)
    : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        var isUserNameTaken = await context.Users
            .AnyAsync(u => u.UserName == request.UserName, cancellationToken);

        if (isUserNameTaken)
            throw new ArgumentException($"Пользователь с логином '{request.UserName}' уже зарегистрирован.");

        var user = new Domain.Entities.User
        {
            Role = request.Role,
            UserName = request.UserName,
            HashPassword = passwordHasher.HashPassword(request.Password),
        };

        context.Users.Add(user);
        await context.SaveChangesAsync(cancellationToken);

        var token = jwtTokenGenerator.GenerateToken(user);

        return new AuthResponse
        {
            User = mapper.Map<UserDto>(user),
            Token = token
        };
    }
}
