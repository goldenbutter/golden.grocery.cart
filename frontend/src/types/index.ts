export interface User {
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
  token: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  total: number;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export interface AdminOrder extends Order {
  customerName: string;
  customerEmail: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}
