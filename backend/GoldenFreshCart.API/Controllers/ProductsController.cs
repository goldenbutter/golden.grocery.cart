using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using GoldenFreshCart.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

// GET endpoints are public — no login required to browse products
// POST, PUT, DELETE require Admin role
[ApiController]
[Route("api/[controller]")]
public class ProductsController(AppDbContext db) : ControllerBase
{
    // GET /api/products?categoryId=1&search=apple
    // Returns only available products (IsAvailable = true) — hidden products are excluded for customers
    // Both categoryId and search are optional query parameters — combine them to filter further
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] string? search)
    {
        var query = db.Products.Include(p => p.Category).AsQueryable();

        // Filter by category if provided
        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        // Search matches against both product name and description
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        var products = await query
            .Where(p => p.IsAvailable)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Unit, p.Stock, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category.Name))
            .ToListAsync();

        return Ok(products);
    }

    // GET /api/products/{id}
    // Returns a single product by ID — used if you need a detail page in the future
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await db.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        if (p == null) return NotFound();
        return Ok(new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Unit, p.Stock, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category.Name));
    }

    // POST /api/products — Admin only
    // Creates a new product; IsAvailable defaults to true in the Product model
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Unit = dto.Unit,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // PUT /api/products/{id} — Admin only
    // Updates all fields including IsAvailable — use this to hide/show a product without deleting it
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, UpdateProductDto dto)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Unit = dto.Unit;
        product.Stock = dto.Stock;
        product.ImageUrl = dto.ImageUrl;
        product.IsAvailable = dto.IsAvailable;
        product.CategoryId = dto.CategoryId;

        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/products/{id} — Admin only
    // Permanently removes a product — consider setting IsAvailable = false instead if you want to keep history
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // GET /api/products/admin/all — Admin only
    // Returns ALL products including hidden ones (IsAvailable = false)
    // Used by the admin panel product management table
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAdmin()
    {
        var products = await db.Products.Include(p => p.Category)
            .Select(p => new ProductDto(p.Id, p.Name, p.Description, p.Price, p.Unit, p.Stock, p.ImageUrl, p.IsAvailable, p.CategoryId, p.Category.Name))
            .ToListAsync();
        return Ok(products);
    }
}
