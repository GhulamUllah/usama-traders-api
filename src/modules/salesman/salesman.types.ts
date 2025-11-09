// src/modules/auth/auth.types.ts

import { Document } from "mongoose";

export interface SalesmanResponse {
  message: string;
}

export interface ISalesman extends Document {
  name?: string;
  phoneNumber: string;
  totalSpent: number;
  totalOrders: number;
  balance: number;
  monthlyRecord: any,
  balanceTrail: any,
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
