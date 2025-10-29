import mongoose, { Schema, Document } from 'mongoose';
import { Order as OrderType, OrderItem } from '../types/types';

const orderItemSchema: Schema = new mongoose.Schema<OrderItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema: Schema = new mongoose.Schema<OrderType & Document>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

export default mongoose.model<OrderType & Document>('Order', orderSchema);