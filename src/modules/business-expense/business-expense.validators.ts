// src/modules/user/user.validation.ts

import mongoose from "mongoose";
import { z } from "zod";

export const createBusinessSchema = z.object({
  description: z.string().trim(),
  amount: z.number()
});

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const deleteBusinessSchema = z.object({
  expenseId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Business ID",
  }),
});

export const updateBusinessSchema = z.object({
  id: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid Business ID",
  }),
  description: z.string().trim(),
  amount: z.number().optional()
});

export type CreateBusiness = z.infer<typeof createBusinessSchema>;
export type DeleteBusiness = z.infer<typeof deleteBusinessSchema>;
export type UpdateBusiness = z.infer<typeof updateBusinessSchema>;
