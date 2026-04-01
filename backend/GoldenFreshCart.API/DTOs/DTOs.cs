// DTOs (Data Transfer Objects) define the shape of data coming in and going out of the API.
// They are separate from the database models — this keeps the API contract clean
// and prevents exposing internal fields like PasswordHash.

namespace GoldenFreshCart.API.DTOs;

// --- Auth ---
// Used for POST /api/auth/register
public record RegisterDto(string Name, string Email, string Password);

// Used for POST /api/auth/login
public record LoginDto(string Email, string Password);

// Returned after successful login or register — includes JWT token and user info
public record AuthResponseDto(string Token, string Name, string Email, string Role);

// --- Products ---
// Returned by GET /api/products and GET /api/products/{id}
// CategoryName is joined from the Category table so the frontend doesn't need a second request
public record ProductDto(int Id, string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, bool IsAvailable, int CategoryId, string CategoryName);

// Used by Admin for POST /api/products — IsAvailable defaults to true in the model
public record CreateProductDto(string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, int CategoryId);

// Used by Admin for PUT /api/products/{id} — includes IsAvailable so admin can hide/show a product
public record UpdateProductDto(string Name, string Description, decimal Price, string Unit, int Stock, string ImageUrl, bool IsAvailable, int CategoryId);

// --- Categories ---
// ProductCount is the number of available (not hidden) products in that category
public record CategoryDto(int Id, string Name, string Slug, string Icon, int ProductCount);

// --- Cart / Orders ---
// Cart is managed entirely client-side — this DTO is only used when placing an order
public record CartItemDto(int ProductId, int Quantity);

// Used for POST /api/orders — sends cart contents and delivery address to the backend
public record PlaceOrderDto(List<CartItemDto> Items, string DeliveryAddress);

// A single item within an order response — includes snapshot of product name and image
public record OrderItemDto(int ProductId, string ProductName, string ImageUrl, int Quantity, decimal UnitPrice);

// Full order response returned to customer — used in GET /api/orders/my
public record OrderDto(int Id, string Status, decimal Total, string DeliveryAddress, DateTime CreatedAt, List<OrderItemDto> Items);

// Used by Admin for PUT /api/orders/admin/{id}/status
// Valid status values: "Pending", "Processing", "Delivered", "Cancelled"
public record UpdateOrderStatusDto(string Status);

// --- Admin Dashboard ---
// Returned by GET /api/orders/admin/stats — shown on the admin dashboard
// TotalUsers counts only Customers (not Admin accounts)
public record DashboardStatsDto(int TotalOrders, int TotalProducts, int TotalUsers, decimal TotalRevenue);

// Returned by GET /api/auth/admin/customers — lists all registered customers for admin view
// PasswordHash is intentionally excluded — never expose it outside the backend
public record CustomerDto(int Id, string Name, string Email, DateTime CreatedAt);
