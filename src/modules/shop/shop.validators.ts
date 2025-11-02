// src/modules/user/user.validation.ts

import mongoose from "mongoose";
import { z } from "zod";
import { ta } from "zod/v4/locales";

export const createShopSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  taxRate: z
    .number({ error: "Tax rate must be a number" })
    .min(0, "Tax rate cannot be negative")
    .optional()
    .default(0),
  createdBy: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid customer ID",
  }),
});

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const deleteShopSchema = z.object({
  shopId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid customer ID",
  }),
});

export const updateShopSchema = z.object({
  shopId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: "Invalid customer ID",
  }),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  taxRate: z
    .number({ error: "Tax rate must be a number" })
    .min(0, "Tax rate cannot be negative")
    .optional()
    .default(0),
});

export type CreateShop = z.infer<typeof createShopSchema>;
export type DeleteShop = z.infer<typeof deleteShopSchema>;
export type UpdateShop = z.infer<typeof updateShopSchema>;
