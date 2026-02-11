import { model, Schema, type HydratedDocument } from 'mongoose';

export interface UserSchema {
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<UserSchema>;

const userSchema = new Schema<UserSchema>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = model<UserSchema>('User', userSchema);
