// src/modules/user/user.validation.ts

import mongoose from "mongoose";
import { z } from "zod";

export const createSalesmanSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim()
    .optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long")
    .trim(),
});

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const deleteSalesmanSchema = z.object({
  salesmanId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salesman ID",
  }),
});

export const getSalesmanByIdSchema = z.object({
  salesmanId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salesman ID",
  }),
});

export const updateSalesmanSchema = z.object({
  salesmanId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salesman ID",
  }),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim()
    .optional(),
  balance: z.number().optional(),
  reason: z.string().optional()
});
export const resetSalesmanSchema = z.object({
  salesmanId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Salesman ID",
  })
})

export type CreateSalesman = z.infer<typeof createSalesmanSchema>;
export type DeleteSalesman = z.infer<typeof deleteSalesmanSchema>;
export type UpdateSalesman = z.infer<typeof updateSalesmanSchema>;
export type GetSalesmanById = z.infer<typeof getSalesmanByIdSchema>;
export type ResetSalesman = z.infer<typeof resetSalesmanSchema>;
