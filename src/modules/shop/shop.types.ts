// src/modules/auth/auth.types.ts

import { Document, ObjectId } from "mongoose";

export interface ShopResponse {
  message: string;
}

export interface IShop extends Document {
  name: string;
  taxRate: number;
  totalProducts: number;
  createdBy: ObjectId;
  totalSales?: number;
  totalRevenue?: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
