import mongoose, { Document } from 'mongoose';

// 1️⃣ Define Transaction Types
export type TransactionType = 'credit' | 'debit';
export interface TransactionResponse {
  message: string;
}

// 2️⃣ Transaction Interface
export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  performer: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null; // optional soft delete
}
