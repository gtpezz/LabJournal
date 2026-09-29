using LabJournal.Application.Features.User.Auth.Login;
using LabJournal.Application.Features.User.Auth.Register;
using LabJournal.Application.Features.User.DTOs;
using LabJournal.Application.Features.User.Query.GetCurrentUser;
using MediatR;
using System.Security.Claims;

namespace LabJournal.WebApi.Endpoints;

public class AuthEndpoints : IEndpointModule
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/login", async (LoginUserCommand command, HttpContext context, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);

            context.Response.Cookies.Append("jwt_user", result.Token);

            return Results.Ok(new { Message = "Успешный вход в систему" });
        })
        .WithName("Login")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .AllowAnonymous();

        group.MapPost("/register", async (RegisterUserCommand command, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return Results.Ok(result);
        })
        .WithName("Register")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .AllowAnonymous();

        group.MapPost("/logout", (HttpContext context) =>
        {
            context.Response.Cookies.Delete("jwt_user");

            return Results.Ok(new { message = "Вы успешно вышли из системы" });
        });

        group.MapGet("/me", async (ClaimsPrincipal claims, ISender sender, CancellationToken ct) =>
        {
            var userIdClaim = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var id))
                return Results.Unauthorized();

            var query = new GetCurrentUserQuery { Id = id };
            var userDto = await sender.Send(query, ct);

            return Results.Ok(userDto);
        })
       .WithName("GetCurrentUser")
       .Produces<UserDto>(StatusCodes.Status200OK)
       .Produces(StatusCodes.Status401Unauthorized)
       .RequireAuthorization();
    }
}