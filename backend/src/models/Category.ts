import mongoose, { Schema, Document } from 'mongoose';
import { Category as CategoryType } from '../types/types';

const categorySchema: Schema = new mongoose.Schema<CategoryType & Document>({
  name: { type: String, required: true },
  description: { type: String, required: true }
});

export default mongoose.model<CategoryType & Document>('Category', categorySchema);