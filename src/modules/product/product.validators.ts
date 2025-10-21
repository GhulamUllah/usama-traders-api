// src/modules/user/user.validation.ts

import mongoose from 'mongoose';
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim(),
  inStock: z.number().min(1, 'Stock must be at least 1'),
  price: z.number().min(1, 'Price must be at least 1'),
  createdBy: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid User ID',
  }),
  createdIn: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid Shop ID',
  }),
});

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const deleteProductSchema = z.object({
  productId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid product ID',
  }),
});

export const getProductSchema = z.object({
  shopId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid Shop ID',
  }),
});

export const updateProductSchema = z.object({
  productId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid product ID',
  }),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  price: z.number().min(1, 'Price must be at least 1').optional(),
}).refine(({ name, price }) => (name || price) ?? false);

export type GetProduct = z.infer<typeof getProductSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type DeleteProduct = z.infer<typeof deleteProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
