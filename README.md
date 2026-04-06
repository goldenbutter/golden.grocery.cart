# 🛒 GoldenFreshCart

**A fully functional, production-grade Norwegian grocery store web application** built with a modern full-stack architecture. Features a complete shopping experience from product browsing to order placement, backed by a secure REST API with role-based authentication.

---

<div align="center">
  <video src="https://github.com/user-attachments/assets/a793eaf0-9718-4ccd-a255-e901fac5eeb5" width="100%" controls autoplay loop muted></video>
</div>

## 🌐 Live Demo

**[https://goldenfreshcart.ibithun.com/](https://goldenfreshcart.ibithun.com)**

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://goldenfreshcart.ibithun.com |
| Backend API | Railway | https://goldengrocerycart-production.up.railway.app |

---

## ✨ Features

### 🛍️ Customer Experience
- Browse and search products by category with EN/NO language toggle
- Add to cart with quantity stepper and fly-to-cart animation
- Secure checkout and order placement
- View full order history and status

### 🔐 Authentication & Security
- JWT-based authentication with protected routes
- Role-based access control (Customer / Admin)
- Secure registration and login system

### 🛠️ Admin Panel
- Dashboard with live stats (orders, revenue, users, products)
- Add, edit, delete products (with image, stock, availability)
- View all customer orders
- Update order status (Pending → Processing → Delivered)

### 💰 Localized for Norway
- Prices displayed in Norwegian Krone (kr)
- Clean, whole-number price formatting

---

## 🧰 Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS |
| Backend    | ASP.NET Core 10 Web API                 |
| Database   | PostgreSQL (Supabase) via Entity Framework Core |
| Auth       | JWT Bearer Tokens                       |
| State      | Zustand                                 |

---

## 🚀 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)

Install EF Core CLI tools:
```bash
dotnet tool install --global dotnet-ef
```

> On Windows, if `dotnet-ef` is not found after install, reopen your terminal or use the full path: `~/.dotnet/tools/dotnet-ef`

---

### Backend

```bash
cd backend/GoldenFreshCart.API

# Restore packages
dotnet restore

# Create and seed the database
dotnet-ef migrations add InitialCreate
dotnet-ef database update

# Run the API (http://localhost:5000)
dotnet run
```

> The database is also auto-created on first `dotnet run` if migrations already exist.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### Open the app

Visit: **http://localhost:5173**

Both terminals must stay running at the same time.


### Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@goldenfreshcart.com | Admin@123 |
| Customer | Register via /register | — |

---

## 📸 Screenshots

🧩 **Landing page**

<img alt="Landing Page" src="assets/landing-page.png" style="max-width:100%;" />

🧩 **Sign-up page**

<img alt="Sign-up Page" src="assets/sign-up-page.png" style="max-width:100%;" />

🧩 **Login page**

<img alt="Login Page" src="assets/login-page.png" style="max-width:100%;" />

🧩 **All Products Page**

<img alt="All Products Page" src="assets/all-product-page.png" style="max-width:100%;" />

🧩 **Cart**

<img alt="Cart" src="assets/cart.png" style="max-width:100%;" />

🧩 **Checkout Page**

<img alt="Checkout Page" src="assets/checkout-page.png" style="max-width:100%;" />

🧩 **Order Page**

<img alt="Order Page" src="assets/order-page.png" style="max-width:100%;" />

🧩 **Admin Panel Dashboard**

<img alt="Admin Panel Dashboard" src="assets/admin-panel-dashboard.png" style="max-width:100%;" />

🧩 **Admin Panel Orders**

<img alt="Admin Panel Orders" src="assets/admin-panel-orders.png" style="max-width:100%;" />

---

## 📁 Project Structure

```
golden.grocery.cart/
├── vercel.json               # Vercel build config (build command, output dir, SPA rewrites)
├── backend/
│   └── GoldenFreshCart.API/
│       ├── Controllers/      # Auth, Products, Categories, Orders
│       ├── Data/             # AppDbContext + seed data
│       ├── DTOs/             # Request/response models
│       ├── Models/           # Entity models
│       ├── Services/         # JWT token service
│       ├── Dockerfile        # Docker image for Railway deployment
│       ├── Program.cs
│       └── appsettings.json
└── frontend/
    ├── .env.development      # Local dev API URL — http://localhost:8080 (not committed to git)
    ├── .env.production       # Production Railway API URL (not committed to git)
    └── src/
        ├── api/              # Fetch wrappers for all endpoints
        ├── components/       # Navbar, Footer, CartSidebar, ProductCard
        ├── pages/            # Home, Shop, Login, Register, Checkout, Orders, Admin
        ├── store/            # Zustand auth + cart stores
        └── types/            # TypeScript interfaces
```

---

## 🚀 Deployment Configuration

### Vercel (Frontend)
- Connect your GitHub repo to Vercel and select the "goldenbutter's projects" team
- `vercel.json` at the project root handles the build config automatically
- Add environment variable in Vercel dashboard:
  - `VITE_API_URL` = your Railway backend URL (e.g. `https://your-app.up.railway.app`)
- React Router 404s on refresh are handled by the `rewrites` rule in `vercel.json`
- Add your custom domain (`goldenfreshcart.ibithun.com`) in **Vercel → Project → Settings → Domains**
  - Then add a CNAME record at your DNS provider: `goldenfreshcart` → `cname.vercel-dns.com`

### Railway (Backend)
- Connect your GitHub repo to Railway → set root directory to `backend/GoldenFreshCart.API`
- Railway uses the `Dockerfile` automatically for builds
- Add environment variables in Railway dashboard:
  - `DATABASE_URL` = Supabase session pooler connection URI (see below)
  - `ASPNETCORE_URLS` = `http://0.0.0.0:8080`
  - `ASPNETCORE_ENVIRONMENT` = `Production`
- The app auto-runs EF Core migrations and seeds data on first startup

### Supabase (Database)
- Create a free project at [supabase.com](https://supabase.com)
- Go to **Connect** → copy the **Session pooler** URI (port **5432**)
  > ⚠️ Use session pooler (port 5432), NOT transaction pooler (port 6543) — EF Core requires persistent connections
- Set this URI as `DATABASE_URL` in Railway
- For local development, use the key=value format in `appsettings.json`:
  ```
  Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=yourpassword;SSL Mode=Require;Trust Server Certificate=true
  ```

### CORS
After deploying, update `Program.cs` to allow your Vercel domain:
```csharp
policy.WithOrigins("http://localhost:5173", "https://goldenfreshcart.ibithun.com")
```

---

## Author

**Bithun** — Senior Technical Consultant

---

## License

This project is licensed under the [MIT License](LICENSE).

© 2026 [Bithun](https://github.com/goldenbutter). All rights reserved.
