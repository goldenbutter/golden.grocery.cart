namespace GoldenFreshCart.API.DTOs;

// Auth
public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, string Name, string Email, string Role);

// Products
public record ProductDto(int Id, string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, bool IsAvailable, int CategoryId, string CategoryName);
public record CreateProductDto(string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, int CategoryId);
public record UpdateProductDto(string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, bool IsAvailable, int CategoryId);

// Categories
public record CategoryDto(int Id, string Name, string Slug, string Icon, int ProductCount);

// Cart (client-side managed, DTOs for order placement)
public record CartItemDto(int ProductId, int Quantity);

// Orders
public record PlaceOrderDto(List<CartItemDto> Items, string DeliveryAddress);
public record OrderItemDto(int ProductId, string ProductName, string ImageUrl, int Quantity, decimal UnitPrice);
public record OrderDto(int Id, string Status, decimal Total, string DeliveryAddress, DateTime CreatedAt, List<OrderItemDto> Items);
public record UpdateOrderStatusDto(string Status);

// Admin stats
public record DashboardStatsDto(int TotalOrders, int TotalProducts, int TotalUsers, decimal TotalRevenue);
