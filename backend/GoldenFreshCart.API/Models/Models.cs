namespace GoldenFreshCart.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Password is stored as a BCrypt hash — never stored as plain text
    public string PasswordHash { get; set; } = string.Empty;

    // Role is either "Customer" (default on registration) or "Admin"
    // Admin accounts must be created manually in the database or seeded
    public string Role { get; set; } = "Customer";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Slug is used for URL-friendly category filtering (e.g. "fruits-vegetables")
    public string Slug { get; set; } = string.Empty;

    // Emoji icon displayed next to the category name in the frontend
    public string Icon { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Price is in Norwegian Krone (kr) — displayed as whole numbers on the frontend
    public decimal Price { get; set; }

    // Unit describes what the price applies to (e.g. "kg", "litre", "bunch", "4 pack")
    public string Unit { get; set; } = string.Empty;

    // Stock is decremented when an order is placed — checked before order confirmation
    public int Stock { get; set; }

    // External Unsplash image URL — if an image breaks, update this in AppDbContext.cs
    // and reset the database to apply the new URL
    public string ImageUrl { get; set; } = string.Empty;

    // When IsAvailable is false, the product is hidden from customers but visible to admins
    public bool IsAvailable { get; set; } = true;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    // Order lifecycle: Pending → Processing → Delivered (or Cancelled at any point)
    // Status is updated manually by the Admin from the admin panel
    public string Status { get; set; } = "Pending";

    // Total is calculated at the time of order placement from item prices — not recalculated later
    public decimal Total { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Quantity { get; set; }

    // UnitPrice is snapshotted from the product price at the time of order
    // So if the product price changes later, past orders still show the original price
    public decimal UnitPrice { get; set; }
}
