using LabJournal.Application.Common.Interfaces;
using LabJournal.Infrastructure.Authorization;
using LabJournal.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LabJournal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddScoped<IApplicationDbContext, ApplicationDbContext>();

        service.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        service.AddScoped<IPasswordHasher, PasswordHasher>();

        var connectionString = configuration.GetConnectionString("DefaultConnection");

        service.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString));

        return service;
    }
}
