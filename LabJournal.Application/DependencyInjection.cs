using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LabJournal.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection service, IConfiguration configuration)
    {
        var assembly = Assembly.GetExecutingAssembly();

        service.AddAutoMapper(cfg => { }, assembly);
        service.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(assembly);
        });

        return service;
    }
}
