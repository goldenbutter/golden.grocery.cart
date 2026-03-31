using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

// Public endpoint — no authentication required to browse categories
[ApiController]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    // GET /api/categories
    // Returns all categories with a count of available products in each
    // ProductCount only counts products where IsAvailable = true (hidden products are excluded)
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
