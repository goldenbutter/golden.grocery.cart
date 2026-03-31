using Microsoft.EntityFrameworkCore;
using GoldenFreshCart.API.Models;

namespace GoldenFreshCart.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(w => 
            w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Order>()
            .Property(o => o.Total)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.UnitPrice)
            .HasColumnType("decimal(18,2)");

        // Seed categories
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Fruits & Vegetables", Slug = "fruits-vegetables", Icon = "🥦" },
            new Category { Id = 2, Name = "Dairy & Eggs", Slug = "dairy-eggs", Icon = "🥛" },
            new Category { Id = 3, Name = "Bakery", Slug = "bakery", Icon = "🍞" },
            new Category { Id = 4, Name = "Meat & Seafood", Slug = "meat-seafood", Icon = "🥩" },
            new Category { Id = 5, Name = "Beverages", Slug = "beverages", Icon = "🧃" },
            new Category { Id = 6, Name = "Snacks", Slug = "snacks", Icon = "🍿" }
        );

        // Seed products
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Organic Bananas", Description = "Fresh organic bananas, perfect for smoothies and snacking.", Price = 25.00m, Unit = "bunch", Stock = 100, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400" },
            new Product { Id = 2, Name = "Red Apples", Description = "Crisp and sweet red apples sourced from local orchards.", Price = 35.00m, Unit = "kg", Stock = 80, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400" },
            new Product { Id = 3, Name = "Baby Spinach", Description = "Tender baby spinach leaves, washed and ready to eat.", Price = 39.00m, Unit = "bag", Stock = 60, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400" },
            new Product { Id = 4, Name = "Cherry Tomatoes", Description = "Vine-ripened cherry tomatoes bursting with flavour.", Price = 32.00m, Unit = "punnet", Stock = 70, CategoryId = 1, ImageUrl = "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400" },
            new Product { Id = 5, Name = "Whole Milk", Description = "Full-cream fresh whole milk from grass-fed cows.", Price = 22.00m, Unit = "litre", Stock = 120, CategoryId = 2, ImageUrl = "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" },
            new Product { Id = 6, Name = "Free Range Eggs", Description = "A dozen large free-range eggs.", Price = 59.00m, Unit = "dozen", Stock = 90, CategoryId = 2, ImageUrl = "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400" },
            new Product { Id = 7, Name = "Greek Yoghurt", Description = "Thick and creamy authentic Greek-style yoghurt.", Price = 45.00m, Unit = "500g", Stock = 55, CategoryId = 2, ImageUrl = "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400" },
            new Product { Id = 8, Name = "Sourdough Loaf", Description = "Artisan sourdough baked fresh daily with a tangy crust.", Price = 69.00m, Unit = "loaf", Stock = 40, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
            new Product { Id = 9, Name = "Croissants", Description = "Buttery, flaky French croissants baked fresh each morning.", Price = 49.00m, Unit = "4 pack", Stock = 35, CategoryId = 3, ImageUrl = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400" },
            new Product { Id = 10, Name = "Chicken Breast", Description = "Skinless free-range chicken breast fillets.", Price = 119.00m, Unit = "kg", Stock = 65, CategoryId = 4, ImageUrl = "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400" },
            new Product { Id = 11, Name = "Atlantic Salmon", Description = "Fresh Atlantic salmon fillets, skin on.", Price = 159.00m, Unit = "kg", Stock = 30, CategoryId = 4, ImageUrl = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400" },
            new Product { Id = 12, Name = "Orange Juice", Description = "Freshly squeezed 100% pure orange juice, no added sugar.", Price = 49.00m, Unit = "litre", Stock = 75, CategoryId = 5, ImageUrl = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400" },
            new Product { Id = 13, Name = "Sparkling Water", Description = "Natural sparkling mineral water, lightly carbonated.", Price = 25.00m, Unit = "1.5L", Stock = 110, CategoryId = 5, ImageUrl = "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400" },
            new Product { Id = 14, Name = "Hot Dog", Description = "Classic beef hot dog sausages, ready to grill or boil.", Price = 89.00m, Unit = "6 pack", Stock = 85, CategoryId = 4, ImageUrl = "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400" },
            new Product { Id = 15, Name = "Dark Chocolate", Description = "70% cocoa rich dark chocolate bar.", Price = 39.00m, Unit = "bar", Stock = 95, CategoryId = 6, ImageUrl = "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400" }
        );

        // Seed admin user (password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Bithun",
                Email = "admin@goldenfreshcart.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
