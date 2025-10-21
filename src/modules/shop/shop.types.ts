// src/modules/auth/auth.types.ts

import { Document, ObjectId } from 'mongoose';

export interface ShopResponse {
  message: string;
}

export interface IShop extends Document {
  name: string;
  createdBy: ObjectId;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
