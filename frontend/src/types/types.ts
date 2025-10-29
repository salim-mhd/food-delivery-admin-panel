export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Product {
  _id: string;
  name: string;
  categoryId: string;
  price: number | null;
  status: 'active' | 'inactive';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number | null;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
}

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}