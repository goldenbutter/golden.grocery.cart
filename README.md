# 🛒 GoldenFreshCart

A full-stack grocery store application by **Bithun**.

**Stack:** ASP.NET Core 10 · React 19 · TypeScript · Vite · Tailwind CSS · SQLite · JWT Auth

---

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

Install EF Core tools if you haven't:
```bash
dotnet tool install --global dotnet-ef
```

---

## Setup & Run

### 1. Backend

```bash
cd backend/GoldenFreshCart.API

# Restore packages
dotnet restore

# Create and seed the database
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the API (http://localhost:5000)
dotnet run
```

### 2. Frontend (new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### 3. Open the app

Visit: **http://localhost:5173**

---

## Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@goldenfreshcart.com | Admin@123 |
| Customer | Register via /register | — |

---

## Features

### Customer
- Browse 15+ products across 6 categories
- Search and filter by category
- Add to cart, adjust quantities
- Checkout with delivery address
- View order history and status

### Admin (`/admin`)
- Dashboard with live stats (orders, revenue, users, products)
- Add, edit, delete products (with image, stock, availability)
- View all customer orders
- Update order status (Pending → Processing → Delivered)

---

## Project Structure

```
grocery.store/
├── backend/
│   └── GoldenFreshCart.API/
│       ├── Controllers/      # Auth, Products, Categories, Orders
│       ├── Data/             # AppDbContext + seed data
│       ├── DTOs/             # Request/response models
│       ├── Models/           # Entity models
│       ├── Services/         # JWT token service
│       ├── Program.cs
│       └── appsettings.json
└── frontend/
    └── src/
        ├── api/              # Fetch wrappers for all endpoints
        ├── components/       # Navbar, Footer, CartSidebar, ProductCard
        ├── pages/            # Home, Shop, Login, Register, Checkout, Orders, Admin
        ├── store/            # Zustand auth + cart stores
        └── types/            # TypeScript interfaces
```

---

© 2026 Bithun. All rights reserved.
