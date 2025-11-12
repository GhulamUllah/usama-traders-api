import mongoose from "mongoose";
import { z } from "zod";

// ✅ Helper for ObjectId validation
const objectId = z.custom<mongoose.Types.ObjectId>(
  (val) => mongoose.isValidObjectId(val),
  { message: "Invalid ObjectId" },
);

// ✅ Get Transaction by ID
export const getTransactionByIdSchema = z.object({
  id: objectId,
});

// ✅ Get All Transactions (with Pagination)
export const getAllTransactionsSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, { message: "Page must be greater than 0" })
    .optional()
    .default(1),

  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .optional()
    .default(10),

  search: z.string().trim().optional().default(""),
});

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
  salesmanId: objectId.optional(),
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

// ✅ Get Transactions for a Customer
export const updateTransactionsSchema = z.object({
  transactionId: objectId,
  debt: z.array(z.object({
    description: z.string().optional().default(""),
    amount: z.number(),
  })),
});


// ✅ Delete Transaction
export const deleteTransactionSchema = z.object({
  transactionId: objectId,
});

// ✅ Pay Remaining Transaction
export const payRemainingSchema = z.object({
  transactionId: objectId,
  debtId: objectId,
});

// ✅ Inferred Types for TypeScript
export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type GetTransactions = z.infer<typeof getTransactionsSchema>;
export type DeleteTransaction = z.infer<typeof deleteTransactionSchema>;
export type GetTransactionById = z.infer<typeof getTransactionByIdSchema>;
export type GetAllTransactionsQuery = z.infer<typeof getAllTransactionsSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionsSchema>;
export type PayRemaining = z.infer<typeof payRemainingSchema>;
