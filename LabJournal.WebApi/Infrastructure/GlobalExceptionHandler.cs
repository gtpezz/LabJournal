using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace LabJournal.WebApi.Infrastructure;

public class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (statusCode, title, detail) = exception switch
        {
            KeyNotFoundException =>
                (StatusCodes.Status404NotFound, "Not Found", exception.Message),

            ArgumentException =>
                (StatusCodes.Status400BadRequest, "Bad Request", exception.Message),

            UnauthorizedAccessException =>
                (StatusCodes.Status401Unauthorized, "Unauthorized", exception.Message),

            Microsoft.EntityFrameworkCore.DbUpdateException =>
                (StatusCodes.Status409Conflict, "Database Conflict", "Операция отклонена: нарушение уникальности данных или запись используется в журнале."),

            _ =>
                (StatusCodes.Status500InternalServerError, "Server Error", "Произошла внутренняя ошибка сервера.")
        };

        httpContext.Response.StatusCode = statusCode;

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception.Message,
            Instance = $"{httpContext.Request.Method} {httpContext.Request.Path}"
        };

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
