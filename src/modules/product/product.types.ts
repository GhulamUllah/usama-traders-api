// src/modules/auth/auth.types.ts

import { Document, ObjectId } from "mongoose";

export interface ProductResponse {
  message: string;
}

export interface IProduct extends Document {
  name: string;
  inStock: number;
  price: number;
  retail: number;
  discount?: number;
  createdBy: ObjectId;
  createdIn: ObjectId;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
