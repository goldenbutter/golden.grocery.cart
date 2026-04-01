// Central TypeScript interfaces — all API responses and state shapes are defined here.
// If you add a new field to a backend DTO, update the matching interface here too.

// User stored in Zustand authStore and localStorage after login/register
// token is the JWT used in all authenticated API requests
export interface User {
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
  token: string;
}

// Returned by GET /api/categories
// productCount is the number of available (not hidden) products in the category
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

// Returned by GET /api/products and GET /api/products/{id}
// price is in Norwegian Krone (kr) — displayed as whole number with toFixed(0)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;         // e.g. "kg", "litre", "bunch", "4 pack"
  stock: number;
  imageUrl: string;
  isAvailable: boolean; // false = hidden from customers, visible to admin only
  categoryId: number;
  categoryName: string; // joined from Category — avoids a second API call
}

// Represents a product in the shopping cart — stored in cartStore (in-memory, not persisted)
export interface CartItem {
  product: Product;
  quantity: number;
}

// A single item within an order — unitPrice is snapshotted at order time
export interface OrderItem {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

// Order returned by GET /api/orders/my
// status lifecycle: Pending → Processing → Delivered (or Cancelled)
export interface Order {
  id: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  total: number;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

// Extends Order with customer info — used in the admin orders view
export interface AdminOrder extends Order {
  customerName: string;
  customerEmail: string;
}

// Returned by GET /api/orders/admin/stats — shown on the admin dashboard
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;   // Only counts Customer role accounts
  totalRevenue: number;
}

// Returned by GET /api/auth/admin/customers — used in the admin Customers tab
export interface CustomerUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}
