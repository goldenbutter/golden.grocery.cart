using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GoldenFreshCart.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace GoldenFreshCart.API.Services;

// Responsible for generating signed JWT tokens for authenticated users
// Tokens are used by the frontend to authenticate all API requests via the Authorization header
public class TokenService(IConfiguration config)
{
    public string GenerateToken(User user)
    {
        // Sign the token with the secret key from appsettings.json
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Embed user identity and role into the token payload
        // These claims are extracted in controllers via User.FindFirstValue(...)
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Used to identify the user in orders
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)                      // Used by [Authorize(Roles = "Admin")]
        };

        // Token is valid for 7 days — after that the user must log in again
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
