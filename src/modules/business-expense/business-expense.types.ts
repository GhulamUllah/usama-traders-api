// src/modules/auth/auth.types.ts

import { Document, ObjectId } from "mongoose";

export interface BusinessResponse {
  message: string;
}

export interface IBusiness extends Document {
  description: string;
  createdBy: ObjectId;
  amount: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
