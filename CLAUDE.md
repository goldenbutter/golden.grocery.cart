# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GoldenFreshCart is a full-stack Norwegian grocery store app by Bithun.
- **Backend**: ASP.NET Core 10 Web API — `backend/GoldenFreshCart.API/`
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS — `frontend/`
- **Database**: SQLite via EF Core (file: `backend/GoldenFreshCart.API/goldenfreshcart.db`)
- **Auth**: JWT (Bearer tokens stored in `localStorage`)
- **Currency**: Norwegian Krone (kr), prices displayed as whole numbers (`toFixed(0)`)

---

## Commands

### Backend

```bash
cd backend/GoldenFreshCart.API

dotnet restore                                        # Restore packages
dotnet run                                            # Run API on http://localhost:5000
dotnet build                                          # Build only

# Database (EF Core CLI — uses ~/.dotnet/tools/dotnet-ef)
~/.dotnet/tools/dotnet-ef migrations add <Name>       # Add migration
~/.dotnet/tools/dotnet-ef database update             # Apply migrations
~/.dotnet/tools/dotnet-ef migrations remove --force   # Remove last migration
```

To **reset the database** (e.g. after seed data changes): stop the backend, delete `goldenfreshcart.db`, remove and recreate the migration, then run `database update`.

### Frontend

```bash
cd frontend

npm install       # Install dependencies
npm run dev       # Dev server on http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

---

## Architecture

### Backend

All models are defined in a single file: `Models/Models.cs` — `User`, `Category`, `Product`, `Order`, `OrderItem`.

`Data/AppDbContext.cs` configures EF Core and contains **all seed data** (categories, products, admin user). Seed data is baked into migrations — to update seeds, change `AppDbContext.cs`, delete the DB, and recreate the migration.

`Program.cs` wires everything: SQLite, JWT auth, CORS (allows `http://localhost:5173`), and auto-runs `db.Database.Migrate()` on startup.

Controllers follow a flat structure, no service layer except `Services/TokenService.cs` for JWT generation. Route prefix is `/api/*` implicitly via controller attributes.

**Auth roles**: `Customer` (default on register) and `Admin`. Role is embedded in the JWT claim and checked via `[Authorize(Roles = "Admin")]`.

### Frontend

`src/api/index.ts` — single file with all API calls (`authApi`, `productsApi`, `categoriesApi`, `ordersApi`). All requests go through a shared `request<T>()` wrapper that attaches the JWT from `localStorage` and throws on non-OK responses.

`src/store/` — Zustand stores:
- `authStore.ts` — user session, persists `user` object and `token` to `localStorage`
- `cartStore.ts` — cart items + open/close state, in-memory only (not persisted)

`src/App.tsx` — defines all routes. `RequireAuth` redirects to `/login` if no user. `RequireAdmin` additionally checks `user.role === 'Admin'`.

`CartSidebar` is rendered globally inside `App` (always mounted), toggled via `cartStore.isOpen`.

Vite proxies are **not used** — the frontend calls the backend directly at `http://localhost:5000/api` (BASE = `/api` in `api/index.ts` — this works because Vite's dev server proxies `/api` via `vite.config.ts` if configured, otherwise ensure CORS is set).

### Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@goldenfreshcart.com | Admin@123 |
| Customer | Register via /register | — |
