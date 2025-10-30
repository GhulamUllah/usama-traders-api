import mongoose from "mongoose";
import { z } from "zod";

// ✅ Helper for ObjectId validation
const objectId = z.custom<mongoose.Types.ObjectId>(
  (val) => mongoose.isValidObjectId(val),
  { message: "Invalid ObjectId" }
);

// ✅ Sub-schema for Product List Items
const productItemSchema = z.object({
  productId: objectId,
  quantity: z
    .number({ error: "Quantity is required" })
    .positive("Quantity must be greater than 0"),
   price: z
    .number({ error: "Price is required" })
    .positive("Price must be greater than 0"),
  discount: z.number().min(0).optional().default(0),
});

// ✅ Create Transaction Validator
export const createTransactionSchema = z.object({
  customerId: objectId,
  sellerId: objectId,
  shopId: objectId,

  productsList: z
    .array(productItemSchema)
    .nonempty("At least one product is required"),

  paidAmount: z
    .number({ error: "Paid amount is required" })
    .min(0, "Paid amount cannot be negative"),

  flatDiscount: z.number().min(0).optional().default(0),
  useBalance: z.boolean().optional().default(false),
});

// ✅ Get Transactions for a Customer
export const getTransactionsSchema = z.object({
  customerId: objectId,
});

// ✅ Delete Transaction
export const deleteTransactionSchema = z.object({
  transactionId: objectId,
});

// ✅ Inferred Types for TypeScript
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type GetTransactions = z.infer<typeof getTransactionsSchema>;
export type DeleteTransaction = z.infer<typeof deleteTransactionSchema>;
