using System.Text;
using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Read port from Railway's PORT env variable, default to 8080
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Connect to PostgreSQL (Supabase)
// Railway sets DATABASE_URL as a URI — we parse it into key=value format for Npgsql
// Local dev uses DefaultConnection from appsettings.json (already in key=value format)
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    string connStr;
    if (!string.IsNullOrEmpty(databaseUrl))
    {
        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':');
        connStr = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
    }
    else
        connStr = builder.Configuration.GetConnectionString("DefaultConnection")!;
    options.UseNpgsql(connStr);
});

// Read the JWT secret key from appsettings.json — used to sign and verify tokens
// If you change the key, all existing tokens become invalid (users will be logged out)
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,        // Tokens expire after 7 days (set in TokenService)
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Register TokenService as scoped — a new instance per HTTP request
builder.Services.AddScoped<TokenService>();

// Allow requests from local dev and production Netlify frontend
// After deploying to Netlify, replace PLACEHOLDER_NETLIFY_URL with your actual Netlify domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173", "https://goldenfreshcart.netlify.app")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Auto-run any pending EF Core migrations on startup
// This also applies seed data (products, categories, admin user) on the first run
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Middleware order matters — CORS must come before Auth
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
