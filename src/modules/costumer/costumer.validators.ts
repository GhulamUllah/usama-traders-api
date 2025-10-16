// src/modules/user/user.validation.ts

import mongoose from 'mongoose';
import { z } from 'zod';

export const createCostumerSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters long').trim(),
});

// ✅ Inferred TypeScript type (for strong typing in registerUser)

export const deleteCustomerSchema = z.object({
  costumerId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid customer ID',
  }),
});

export const updateCustomerSchema = z.object({
  costumerId: z.custom((val) => mongoose.isValidObjectId(val), {
    message: 'Invalid customer ID',
  }),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  balance: z
    .object({
      amount: z.number().min(1, 'Amount must be at least 1'),
      type: z.enum(['credit', 'debit'], {
        error: 'Type must be either credit or debit',
      }),
      description: z
        .string()
        .max(255, 'Description must not exceed 255 characters')
        .trim()
        .optional(),
    })
    .optional(),
});

export type CreateCustomer = z.infer<typeof createCostumerSchema>;
export type DeleteCustomer = z.infer<typeof deleteCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
