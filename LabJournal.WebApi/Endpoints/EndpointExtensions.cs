using System.Reflection;

namespace LabJournal.WebApi.Endpoints;

public static class EndpointExtensions
{
    public static IApplicationBuilder MapAllEndpoints(this WebApplication app)
    {
        var endpointModules = Assembly.GetExecutingAssembly()
           .GetTypes()
           .Where(t => typeof(IEndpointModule).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract);

        foreach (var moduleType in endpointModules)
        {
            var module = (IEndpointModule)Activator.CreateInstance(moduleType)!;
            module.MapEndpoints(app);
        }

        return app;
    }
}