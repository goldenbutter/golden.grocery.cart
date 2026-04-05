// Centralized API client — all backend calls go through this file.
// To add a new endpoint, add a function here and call it from your component or page.

// In development, VITE_API_URL is set to http://localhost:5000 via .env.development
// In production (Vercel), it is set to the Railway backend URL via the Vercel dashboard env vars
const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000') + '/api';

// Read the JWT token from localStorage — stored there by authStore after login/register
function getToken() {
  return localStorage.getItem('token');
}

// Generic fetch wrapper — attaches auth header, handles errors, and parses JSON
// Throws an Error with the backend's message so components can display it to the user
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach JWT token to every request if the user is logged in
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }

  // 204 No Content — backend returned success but no body (e.g. after DELETE or PUT)
  if (res.status === 204) return undefined as T;
  return res.json();
}

// --- Auth ---
export const authApi = {
  // Returns token + user info — stored in authStore by the login/register pages
  login: (email: string, password: string) =>
    request<{ token: string; name: string; email: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string; name: string; email: string; role: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  // Admin only — returns all registered Customer accounts
  getCustomers: () => request<import('../types').CustomerUser[]>('/auth/admin/customers'),
};

// --- Products ---
export const productsApi = {
  // Fetches available products — optionally filtered by categoryId and/or search term
  getAll: (params?: { categoryId?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.categoryId) q.set('categoryId', String(params.categoryId));
    if (params?.search) q.set('search', params.search);
    return request<import('../types').Product[]>(`/products?${q}`);
  },
  getById: (id: number) => request<import('../types').Product>(`/products/${id}`),

  // Admin only — returns all products including hidden ones (IsAvailable = false)
  getAdminAll: () => request<import('../types').Product[]>('/products/admin/all'),

  create: (data: object) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: object) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
};

// --- Categories ---
export const categoriesApi = {
  // Returns all categories with productCount — used for the category filter pills on ShopPage
  getAll: () => request<import('../types').Category[]>('/categories'),
};

// --- Orders ---
export const ordersApi = {
  // Places a new order — expects cart items and a delivery address
  place: (items: { productId: number; quantity: number }[], deliveryAddress: string) =>
    request<{ orderId: number; total: number }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, deliveryAddress }),
    }),

  // Returns the logged-in user's order history
  myOrders: () => request<import('../types').Order[]>('/orders/my'),

  // Admin only — returns all orders from all customers
  adminAll: () => request<import('../types').AdminOrder[]>('/orders/admin/all'),

  // Admin only — updates order status (Pending / Processing / Delivered / Cancelled)
  updateStatus: (id: number, status: string) =>
    request(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Admin only — returns summary stats for the dashboard
  stats: () => request<import('../types').DashboardStats>('/orders/admin/stats'),
};
