import mongoose from 'mongoose';
import { z } from 'zod';

// ✅ Create Transaction
export const createTransactionSchema = z.object({
  customerId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid customer ID',
  }),
  performer: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid performer (User ID)',
  }),
  amount: z
    .number({
      error: 'Amount is required',
    })
    .positive('Amount must be greater than 0'),
  type: z.enum(['credit', 'debit'], {
    error: () => ({ message: 'Type must be either credit or debit' }),
  }),
  description: z.string().trim().optional(),
});

// ✅ Get transactions of a specific customer
export const getTransactionsSchema = z.object({
  customerId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid customer ID',
  }),
});

// ✅ Delete Transaction
export const deleteTransactionSchema = z.object({
  transactionId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid transaction ID',
  }),
});

// ✅ Inferred Types
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type GetTransactions = z.infer<typeof getTransactionsSchema>;
export type DeleteTransaction = z.infer<typeof deleteTransactionSchema>;
