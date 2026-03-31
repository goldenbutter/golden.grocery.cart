using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using GoldenFreshCart.API.Models;
using GoldenFreshCart.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

// Handles user registration and login — no [Authorize] needed, these are public endpoints
[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokenService) : ControllerBase
{
    // POST /api/auth/register
    // Creates a new Customer account — all new registrations get the "Customer" role
    // To create an Admin, seed one in AppDbContext.cs or update the role directly in the database
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        // Prevent duplicate accounts with the same email
        if (await db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email already registered." });

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            // BCrypt automatically salts and hashes the password — never store plain text
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Customer"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        // Return a JWT token immediately after registration so the user is logged in right away
        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponseDto(token, user.Name, user.Email, user.Role));
    }

    // POST /api/auth/login
    // Validates credentials and returns a JWT token if correct
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        // Use a single generic error message to avoid revealing whether the email exists
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = tokenService.GenerateToken(user);
        return Ok(new AuthResponseDto(token, user.Name, user.Email, user.Role));
    }
}
