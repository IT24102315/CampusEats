using System.Text;
using CampusEats.Api;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
var builder=WebApplication.CreateBuilder(args);
var connection=builder.Configuration.GetConnectionString("Default") ?? throw new InvalidOperationException("Set ConnectionStrings__Default");
var key=builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Set Jwt__Key");
if(Encoding.UTF8.GetByteCount(key)<32) throw new InvalidOperationException("Jwt__Key requires at least 32 bytes");
var origin=builder.Configuration["FrontendOrigin"] ?? "http://localhost:5173";
builder.WebHost.UseUrls($"http://0.0.0.0:{Environment.GetEnvironmentVariable("PORT") ?? "8080"}");
builder.Services.AddDbContext<AppDbContext>(o=>o.UseNpgsql(connection));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o=>o.AddPolicy("Frontend",p=>p.WithOrigins(origin).AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o=>o.TokenValidationParameters=new() {
 ValidateIssuer=true,ValidIssuer=builder.Configuration["Jwt:Issuer"],
 ValidateAudience=true,ValidAudience=builder.Configuration["Jwt:Audience"],
 ValidateIssuerSigningKey=true,IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),ValidateLifetime=true
});
builder.Services.AddAuthorization();
var app=builder.Build();
if(args.Contains("--migrate")) {
 using var scope=app.Services.CreateScope();
 await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.MigrateAsync();
 return;
}
if(app.Environment.IsDevelopment()) {app.UseSwagger();app.UseSwaggerUI();}
app.UseRouting();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health",()=>Results.Ok(new {status="ok"}));
app.Run();
