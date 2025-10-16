// src/modules/user/user.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from './auth.types';

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Exclude password by default when querying
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isApproved: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true },
);

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default UserModel;
