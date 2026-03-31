using System.Security.Claims;
using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using GoldenFreshCart.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController(AppDbContext db) : ControllerBase
{
    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> PlaceOrder(PlaceOrderDto dto)
    {
        if (!dto.Items.Any()) return BadRequest(new { message = "Cart is empty." });

        var productIds = dto.Items.Select(i => i.ProductId).ToList();
        var products = await db.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

        if (products.Count != dto.Items.Count)
            return BadRequest(new { message = "One or more products not found." });

        var order = new Order
        {
            UserId = GetUserId(),
            DeliveryAddress = dto.DeliveryAddress,
            Status = "Pending"
        };

        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if (product.Stock < item.Quantity)
                return BadRequest(new { message = $"Insufficient stock for {product.Name}." });

            product.Stock -= item.Quantity;
            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return Ok(new { orderId = order.Id, total = order.Total });
    }

    [HttpGet("my")]
    public async Task<IActionResult> MyOrders()
    {
        var userId = GetUserId();
        var orders = await db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto(
                o.Id, o.Status, o.Total, o.DeliveryAddress, o.CreatedAt,
                o.Items.Select(i => new OrderItemDto(
                    i.ProductId, i.Product.Name, i.Product.ImageUrl, i.Quantity, i.UnitPrice
                )).ToList()
            ))
            .ToListAsync();
        return Ok(orders);
    }

    // Admin: all orders
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AllOrders()
    {
        var orders = await db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.Id, o.Status, o.Total, o.DeliveryAddress, o.CreatedAt,
                CustomerName = o.User.Name,
                CustomerEmail = o.User.Email,
                Items = o.Items.Select(i => new OrderItemDto(
                    i.ProductId, i.Product.Name, i.Product.ImageUrl, i.Quantity, i.UnitPrice
                )).ToList()
            })
            .ToListAsync();
        return Ok(orders);
    }

    [HttpPut("admin/{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusDto dto)
    {
        var order = await db.Orders.FindAsync(id);
        if (order == null) return NotFound();
        order.Status = dto.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // Admin dashboard stats
    [HttpGet("admin/stats")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Stats()
    {
        var stats = new DashboardStatsDto(
            await db.Orders.CountAsync(),
            await db.Products.CountAsync(),
            await db.Users.CountAsync(u => u.Role == "Customer"),
            await db.Orders.SumAsync(o => o.Total)
        );
        return Ok(stats);
    }
}
