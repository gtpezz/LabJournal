using LabJournal.Application;
using LabJournal.Infrastructure;
using LabJournal.WebApi.Endpoints;
using LabJournal.WebApi.Infrastructure;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddApplication(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(opt =>
    {
        opt.Theme = ScalarTheme.DeepSpace;
    });
}

app.UseHttpsRedirection();

app.UseExceptionHandler();

app.MapAllEndpoints();

app.Run();