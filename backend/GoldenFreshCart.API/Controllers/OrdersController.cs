using System.Security.Claims;
using GoldenFreshCart.API.Data;
using GoldenFreshCart.API.DTOs;
using GoldenFreshCart.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GoldenFreshCart.API.Controllers;

// All endpoints require authentication — customers can only see their own orders
// Admin-specific endpoints require the "Admin" role in addition
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController(AppDbContext db) : ControllerBase
{
    // Helper to extract the logged-in user's ID from the JWT token claims
    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // POST /api/orders
    // Places a new order — deducts stock, snapshots prices, calculates total
    // Returns the new order ID and total so the frontend can redirect to the orders page
    [HttpPost]
    public async Task<IActionResult> PlaceOrder(PlaceOrderDto dto)
    {
        if (!dto.Items.Any()) return BadRequest(new { message = "Cart is empty." });

        // Load all products in one query to avoid N+1 database calls
        var productIds = dto.Items.Select(i => i.ProductId).ToList();
        var products = await db.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

        // Ensure all products in the cart actually exist
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

            // Reject the order if any item exceeds available stock
            if (product.Stock < item.Quantity)
                return BadRequest(new { message = $"Insufficient stock for {product.Name}." });

            // Deduct stock immediately when the order is placed
            product.Stock -= item.Quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                // Snapshot the price at order time — future price changes won't affect this order
                UnitPrice = product.Price
            });
        }

        // Calculate order total from the snapshotted item prices
        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);
        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return Ok(new { orderId = order.Id, total = order.Total });
    }

    // GET /api/orders/my
    // Returns the logged-in customer's order history, newest first
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

    // GET /api/orders/admin/all — Admin only
    // Returns all orders from all customers, newest first — used in the admin orders tab
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

    // PUT /api/orders/admin/{id}/status — Admin only
    // Updates order status — valid values: "Pending", "Processing", "Delivered", "Cancelled"
    // Stock is NOT restored when an order is cancelled — handle that manually if needed
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

    // GET /api/orders/admin/stats — Admin only
    // Returns summary numbers for the admin dashboard: orders, products, customers, revenue
    // TotalUsers counts only Customers (Admin accounts are excluded)
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
