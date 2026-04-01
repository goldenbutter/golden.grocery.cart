using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GoldenFreshCart.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Slug = table.Column<string>(type: "TEXT", nullable: false),
                    Icon = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false),
                    Stock = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    IsAvailable = table.Column<bool>(type: "INTEGER", nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DeliveryAddress = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Icon", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, "🥦", "Fruits & Vegetables", "fruits-vegetables" },
                    { 2, "🥛", "Dairy & Eggs", "dairy-eggs" },
                    { 3, "🍞", "Bakery", "bakery" },
                    { 4, "🥩", "Meat & Seafood", "meat-seafood" },
                    { 5, "🧃", "Beverages", "beverages" },
                    { 6, "🍿", "Snacks", "snacks" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "Name", "PasswordHash", "Role" },
                values: new object[] { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@goldenfreshcart.com", "Admin User", "$2a$11$edKkEKiPpayR.VryA1okveuqq0d.C3Zil0EqWIM0wU4ouhxy/.WlK", "Admin" });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "Description", "ImageUrl", "IsAvailable", "Name", "Price", "Stock", "Unit" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(3818), "Fresh organic bananas, perfect for smoothies and snacking.", "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", true, "Organic Bananas", 25.00m, 100, "bunch" },
                    { 2, 1, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7141), "Crisp and sweet red apples sourced from local orchards.", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", true, "Red Apples", 35.00m, 80, "kg" },
                    { 3, 1, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7145), "Tender baby spinach leaves, washed and ready to eat.", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", true, "Baby Spinach", 39.00m, 60, "bag" },
                    { 4, 1, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7147), "Vine-ripened cherry tomatoes bursting with flavour.", "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400", true, "Cherry Tomatoes", 32.00m, 70, "punnet" },
                    { 5, 2, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7163), "Full-cream fresh whole milk from grass-fed cows.", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400", true, "Whole Milk", 22.00m, 120, "litre" },
                    { 6, 2, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7164), "A dozen large free-range eggs.", "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", true, "Free Range Eggs", 59.00m, 90, "dozen" },
                    { 7, 2, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7166), "Thick and creamy authentic Greek-style yoghurt.", "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", true, "Greek Yoghurt", 45.00m, 55, "500g" },
                    { 8, 3, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7167), "Artisan sourdough baked fresh daily with a tangy crust.", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", true, "Sourdough Loaf", 69.00m, 40, "loaf" },
                    { 9, 3, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7169), "Buttery, flaky French croissants baked fresh each morning.", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", true, "Croissants", 49.00m, 35, "4 pack" },
                    { 10, 4, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7170), "Skinless free-range chicken breast fillets.", "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400", true, "Chicken Breast", 119.00m, 65, "kg" },
                    { 11, 4, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7172), "Fresh Atlantic salmon fillets, skin on.", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", true, "Atlantic Salmon", 159.00m, 30, "kg" },
                    { 12, 5, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7173), "Freshly squeezed 100% pure orange juice, no added sugar.", "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", true, "Orange Juice", 49.00m, 75, "litre" },
                    { 13, 5, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7174), "Natural sparkling mineral water, lightly carbonated.", "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400", true, "Sparkling Water", 25.00m, 110, "1.5L" },
                    { 14, 4, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7176), "Classic beef hot dog sausages, ready to grill or boil.", "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400", true, "Hot Dog", 89.00m, 85, "6 pack" },
                    { 15, 6, new DateTime(2026, 4, 1, 7, 54, 48, 395, DateTimeKind.Utc).AddTicks(7177), "70% cocoa rich dark chocolate bar.", "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400", true, "Dark Chocolate", 39.00m, 95, "bar" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
