// src/modules/auth/auth.types.ts

import { Document, ObjectId } from "mongoose";

export interface SalariesResponse {
  message: string;
}

export interface ISalaries extends Document {
  description: string;
  createdForModel: "Customer" | "Salesman"
  createdFor: ObjectId;
  amount: number;
  createdBy: ObjectId;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
