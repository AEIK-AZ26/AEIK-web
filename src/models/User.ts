import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  displayName: string;
  department: string;
  role: 'admin' | 'member';
  createdAt: number;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  displayName: { type: String, required: true, trim: true },
  department: { type: String, default: 'Layihələrin idarə olunması' },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  createdAt: { type: Number, default: () => Date.now() },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
