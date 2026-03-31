using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await db.Categories
            .Select(c => new CategoryDto(
                c.Id, c.Name, c.Slug, c.Icon,
                c.Products.Count(p => p.IsAvailable)))
            .ToListAsync();
        return Ok(categories);
    }
}
