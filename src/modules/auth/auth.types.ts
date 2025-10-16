// src/modules/auth/auth.types.ts

import { Document } from 'mongoose';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isApproved: boolean;
  role: 'user' | 'admin';
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
