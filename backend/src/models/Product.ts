import mongoose, { Schema, Document } from 'mongoose';
import { Product as ProductType } from '../types/types';

const productSchema: Schema = new mongoose.Schema<ProductType & Document>({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active', enum: ['active', 'inactive'] }
});

export default mongoose.model<ProductType & Document>('Product', productSchema);