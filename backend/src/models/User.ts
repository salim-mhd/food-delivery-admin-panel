import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType } from '../types/types';

const userSchema: Schema = new mongoose.Schema<UserType & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true }
});

export default mongoose.model<UserType & Document>('User', userSchema);