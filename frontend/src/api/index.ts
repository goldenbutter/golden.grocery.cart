const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const authApi = {
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
};

// Products
export const productsApi = {
  getAll: (params?: { categoryId?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.categoryId) q.set('categoryId', String(params.categoryId));
    if (params?.search) q.set('search', params.search);
    return request<import('../types').Product[]>(`/products?${q}`);
  },
  getById: (id: number) => request<import('../types').Product>(`/products/${id}`),
  getAdminAll: () => request<import('../types').Product[]>('/products/admin/all'),
  create: (data: object) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: object) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
};

// Categories
export const categoriesApi = {
  getAll: () => request<import('../types').Category[]>('/categories'),
};

// Orders
export const ordersApi = {
  place: (items: { productId: number; quantity: number }[], deliveryAddress: string) =>
    request<{ orderId: number; total: number }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, deliveryAddress }),
    }),
  myOrders: () => request<import('../types').Order[]>('/orders/my'),
  adminAll: () => request<import('../types').AdminOrder[]>('/orders/admin/all'),
  updateStatus: (id: number, status: string) =>
    request(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  stats: () => request<import('../types').DashboardStats>('/orders/admin/stats'),
};
