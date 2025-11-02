// src/modules/auth/auth.types.ts

import { Document } from "mongoose";

export interface CostumerResponse {
  message: string;
}

export interface ICostumer extends Document {
  name?: string;
  phoneNumber: string;
  balance: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
