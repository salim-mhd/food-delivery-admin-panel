import { Types } from "mongoose";

export interface User {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
}

export interface Category {
  _id?: Types.ObjectId;
  name: string;
  description: string;
}

export interface Product {
  _id?: Types.ObjectId;
  name: string;
  categoryId: Types.ObjectId;
  price: number;
  status?: 'active' | 'inactive';
}

export interface OrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  orderDate?: Date;
}

export interface DashboardSummary {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}